const Product = require("../models/Product");
const User = require("../models/User");
const ChatLog = require("../models/ChatLog");

/**
 * Advanced AI-style e-commerce chatbot controller.
 *
 * This controller does not use a paid LLM API.
 * Instead, it uses:
 * - NLP tokenisation
 * - Naive Bayes-style intent classification
 * - query expansion
 * - fuzzy matching
 * - BM25-style product ranking
 * - personalised scoring
 * - category and brand intelligence
 */

const CONFIG = {
  MAX_MESSAGE_LENGTH: 800,
  DEFAULT_LIMIT: 5,
  MAX_LIMIT: 10,
  MAX_CANDIDATES: 350,
  SEARCH_HISTORY_LIMIT: 50,
  VIEWED_PRODUCT_LIMIT: 40,
};

const FIELD_WEIGHTS = {
  name: 9,
  category: 8,
  brand: 7,
  tags: 6,
  description: 2.5,
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "could",
  "do",
  "does",
  "for",
  "from",
  "get",
  "give",
  "has",
  "have",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "need",
  "of",
  "on",
  "or",
  "please",
  "product",
  "products",
  "show",
  "some",
  "that",
  "the",
  "this",
  "to",
  "under",
  "up",
  "want",
  "with",
  "you",
  "your",
]);

const synonymMap = {
  laptop: ["laptop", "laptops", "notebook", "computer", "pc", "macbook"],
  laptops: ["laptop", "laptops", "notebook", "computer", "pc", "macbook"],
  computer: ["computer", "pc", "desktop", "laptop", "notebook"],

  phone: ["phone", "phones", "mobile", "smartphone", "iphone", "android"],
  mobile: ["mobile", "phone", "smartphone", "iphone", "android"],
  smartphone: ["smartphone", "phone", "mobile", "iphone", "android"],

  trainer: ["trainer", "trainers", "shoe", "shoes", "sneaker", "sneakers", "footwear"],
  trainers: ["trainer", "trainers", "shoe", "shoes", "sneaker", "sneakers", "footwear"],
  shoe: ["shoe", "shoes", "trainer", "trainers", "sneaker", "sneakers"],
  shoes: ["shoe", "shoes", "trainer", "trainers", "sneaker", "sneakers"],

  headphones: ["headphones", "headphone", "headset", "earphones", "earbuds"],
  headphone: ["headphone", "headphones", "headset", "earphones", "earbuds"],
  headset: ["headset", "headphones", "earphones", "earbuds"],
  earbuds: ["earbuds", "earphones", "headphones"],

  watch: ["watch", "smartwatch", "wearable"],
  smartwatch: ["smartwatch", "watch", "wearable"],

  cheap: ["cheap", "budget", "affordable", "low price", "value"],
  budget: ["budget", "cheap", "affordable", "value"],
  affordable: ["affordable", "cheap", "budget", "value"],

  expensive: ["expensive", "premium", "luxury", "flagship", "high end"],
  premium: ["premium", "luxury", "flagship", "high quality", "high end"],
  luxury: ["luxury", "premium", "flagship"],

  gaming: ["gaming", "gamer", "performance", "rgb", "powerful"],
  student: ["student", "budget", "portable", "lightweight", "affordable"],
  office: ["office", "work", "business", "professional"],
  travel: ["travel", "portable", "lightweight", "compact"],
  gym: ["gym", "sport", "sports", "fitness", "training"],
};

const intentTrainingData = {
  greeting: [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good evening",
    "yo",
  ],
  categories: [
    "what categories do you sell",
    "show me categories",
    "show all departments",
    "what type of products are available",
    "what do you sell",
  ],
  product_search: [
    "show me laptops",
    "find phones under 500",
    "i need shoes",
    "search for headphones",
    "show products from nike",
    "find gaming laptop",
  ],
  recommendation: [
    "recommend something for me",
    "suggest products for me",
    "what should i buy",
    "personalised recommendation",
    "recommend best item based on my history",
  ],
  best_products: [
    "show best products",
    "top rated products",
    "highest rated laptop",
    "most popular products",
    "best selling items",
  ],
  compare: [
    "compare products",
    "which one is better",
    "difference between these products",
    "compare first two",
    "iphone vs samsung",
  ],
  checkout_help: [
    "how to checkout",
    "how to place order",
    "how can i pay",
    "cash on delivery",
    "delivery information",
  ],
  order_help: [
    "where is my order",
    "track my order",
    "my order status",
    "latest order",
    "has my order shipped",
  ],
};

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\w£.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const simpleStem = (word) => {
  if (!word) return "";

  if (word.length > 5 && word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }

  if (word.length > 4 && word.endsWith("ing")) {
    return word.slice(0, -3);
  }

  if (word.length > 4 && word.endsWith("ed")) {
    return word.slice(0, -2);
  }

  if (word.length > 3 && word.endsWith("s")) {
    return word.slice(0, -1);
  }

  return word;
};

const tokenize = (text) => {
  return normalizeText(text)
    .replace(/£?\d+(\.\d+)?/g, " ")
    .split(/\s+/)
    .map((word) => simpleStem(word.trim()))
    .filter((word) => word.length > 1 && !stopWords.has(word));
};

const expandQueryTerms = (tokens) => {
  const terms = new Set();

  tokens.forEach((token) => {
    terms.add(token);

    if (synonymMap[token]) {
      synonymMap[token].forEach((synonym) => {
        tokenize(synonym).forEach((term) => terms.add(term));
      });
    }
  });

  return [...terms];
};

const levenshteinDistance = (a, b) => {
  const first = normalizeText(a);
  const second = normalizeText(b);

  if (first === second) return 0;
  if (!first.length) return second.length;
  if (!second.length) return first.length;

  const matrix = [];

  for (let i = 0; i <= second.length; i += 1) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= first.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= second.length; i += 1) {
    for (let j = 1; j <= first.length; j += 1) {
      if (second.charAt(i - 1) === first.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[second.length][first.length];
};

const fuzzySimilarity = (a, b) => {
  const first = normalizeText(a);
  const second = normalizeText(b);

  if (!first || !second) return 0;
  if (first === second) return 1;

  const distance = levenshteinDistance(first, second);
  const maxLength = Math.max(first.length, second.length);

  return 1 - distance / maxLength;
};

const trainIntentModel = () => {
  const vocabulary = new Set();
  const classTokenCounts = {};
  const classTotalTokens = {};
  const classDocumentCounts = {};
  let totalDocuments = 0;

  Object.entries(intentTrainingData).forEach(([intent, examples]) => {
    classTokenCounts[intent] = {};
    classTotalTokens[intent] = 0;
    classDocumentCounts[intent] = examples.length;
    totalDocuments += examples.length;

    examples.forEach((example) => {
      const tokens = tokenize(example);

      tokens.forEach((token) => {
        vocabulary.add(token);
        classTokenCounts[intent][token] = (classTokenCounts[intent][token] || 0) + 1;
        classTotalTokens[intent] += 1;
      });
    });
  });

  return {
    vocabulary: [...vocabulary],
    classTokenCounts,
    classTotalTokens,
    classDocumentCounts,
    totalDocuments,
  };
};

const intentModel = trainIntentModel();

const classifyIntent = (message) => {
  const text = normalizeText(message);
  const tokens = tokenize(message);

  if (/^(hi|hello|hey|yo)\b/.test(text) && tokens.length <= 2) {
    return {
      intent: "greeting",
      confidence: 0.98,
    };
  }

  const vocabularySize = intentModel.vocabulary.length;
  const scores = {};

  Object.keys(intentTrainingData).forEach((intent) => {
    const prior =
      intentModel.classDocumentCounts[intent] / intentModel.totalDocuments;

    let logProbability = Math.log(prior);

    tokens.forEach((token) => {
      const tokenCount = intentModel.classTokenCounts[intent][token] || 0;
      const totalTokens = intentModel.classTotalTokens[intent] || 1;

      const smoothedProbability =
        (tokenCount + 1) / (totalTokens + vocabularySize);

      logProbability += Math.log(smoothedProbability);
    });

    scores[intent] = logProbability;
  });

  const keywordBoosts = {
    categories: ["category", "categories", "department", "sell"],
    compare: ["compare", "better", "difference", "versus", "vs"],
    checkout_help: ["checkout", "payment", "pay", "delivery"],
    order_help: ["order", "track", "shipped", "delivered"],
    recommendation: ["recommend", "suggest", "personalised", "personalized"],
    best_products: ["best", "top", "popular", "rated"],
  };

  Object.entries(keywordBoosts).forEach(([intent, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        scores[intent] += 2.5;
      }
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = sorted[0];
  const second = sorted[1];

  const confidence = second
    ? Math.min(0.98, Math.max(0.55, 1 / (1 + Math.exp(second[1] - best[1]))))
    : 0.7;

  return {
    intent: best[0],
    confidence: Number(confidence.toFixed(2)),
  };
};

const extractPriceRange = (message) => {
  const text = normalizeText(message);

  const betweenMatch = text.match(
    /between\s*£?\s*(\d+(?:\.\d+)?)\s*(?:and|-|to)\s*£?\s*(\d+(?:\.\d+)?)/i
  );

  if (betweenMatch) {
    const first = Number(betweenMatch[1]);
    const second = Number(betweenMatch[2]);

    return {
      minPrice: Math.min(first, second),
      maxPrice: Math.max(first, second),
      targetPrice: null,
    };
  }

  const rangeMatch = text.match(
    /£?\s*(\d+(?:\.\d+)?)\s*(?:-|to)\s*£?\s*(\d+(?:\.\d+)?)/i
  );

  if (rangeMatch) {
    const first = Number(rangeMatch[1]);
    const second = Number(rangeMatch[2]);

    return {
      minPrice: Math.min(first, second),
      maxPrice: Math.max(first, second),
      targetPrice: null,
    };
  }

  const aroundMatch = text.match(
    /(?:around|about|near|approximately|approx)\s*£?\s*(\d+(?:\.\d+)?)/i
  );

  if (aroundMatch) {
    const targetPrice = Number(aroundMatch[1]);

    return {
      minPrice: Math.max(0, Math.round(targetPrice * 0.8)),
      maxPrice: Math.round(targetPrice * 1.2),
      targetPrice,
    };
  }

  const maxMatch =
    text.match(
      /(?:under|below|less than|up to|upto|budget|max|maximum)\s*£?\s*(\d+(?:\.\d+)?)/i
    ) ||
    text.match(/£?\s*(\d+(?:\.\d+)?)\s*(?:or less|maximum|max|budget)/i);

  const minMatch = text.match(
    /(?:over|above|more than|minimum|min|at least)\s*£?\s*(\d+(?:\.\d+)?)/i
  );

  return {
    minPrice: minMatch ? Number(minMatch[1]) : null,
    maxPrice: maxMatch ? Number(maxMatch[1]) : null,
    targetPrice: null,
  };
};

const extractMinimumRating = (message) => {
  const text = normalizeText(message);

  const ratingMatch =
    text.match(/(?:rated|rating|stars?|above)\s*(\d(?:\.\d)?)/i) ||
    text.match(/(\d(?:\.\d)?)\s*(?:stars?|rating)/i);

  if (!ratingMatch) return null;

  const rating = Number(ratingMatch[1]);

  if (Number.isNaN(rating)) return null;

  return Math.min(Math.max(rating, 0), 5);
};

const extractRequestedLimit = (message) => {
  const text = normalizeText(message);

  const match =
    text.match(/\b(?:top|best|show|give|find)\s*(\d{1,2})\b/i) ||
    text.match(/\b(\d{1,2})\s*(?:products|items|options)\b/i);

  if (!match) return CONFIG.DEFAULT_LIMIT;

  const limit = Number(match[1]);

  if (Number.isNaN(limit)) return CONFIG.DEFAULT_LIMIT;

  return Math.min(Math.max(limit, 1), CONFIG.MAX_LIMIT);
};

const detectSortPreference = (message) => {
  const text = normalizeText(message);

  if (/\b(cheapest|cheap|lowest price|low price|budget|affordable)\b/i.test(text)) {
    return "price_low";
  }

  if (/\b(expensive|premium|luxury|high end|flagship)\b/i.test(text)) {
    return "price_high";
  }

  if (/\b(newest|latest|new|recent)\b/i.test(text)) {
    return "newest";
  }

  if (/\b(best rated|highest rated|top rated|rating|stars)\b/i.test(text)) {
    return "rating";
  }

  if (/\b(in stock|available|stock)\b/i.test(text)) {
    return "stock";
  }

  return "smart";
};

const detectUseCase = (message) => {
  const text = normalizeText(message);

  const useCases = {
    gaming: ["gaming", "game", "gamer", "performance", "fps"],
    student: ["student", "university", "college", "study", "budget"],
    office: ["office", "work", "business", "professional"],
    travel: ["travel", "portable", "lightweight", "compact"],
    fitness: ["gym", "fitness", "training", "sport", "running"],
    premium: ["premium", "luxury", "flagship", "high end"],
    budget: ["cheap", "budget", "affordable", "value"],
  };

  const matchedUseCases = [];

  Object.entries(useCases).forEach(([useCase, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      matchedUseCases.push(useCase);
    }
  });

  return matchedUseCases;
};

const getCatalogueEntities = async () => {
  const [categories, brands] = await Promise.all([
    Product.distinct("category"),
    Product.distinct("brand"),
  ]);

  return {
    categories: categories.filter(Boolean),
    brands: brands.filter(Boolean),
  };
};

const detectEntitiesFromCatalogue = ({ message, categories, brands }) => {
  const text = normalizeText(message);
  const tokens = tokenize(message);

  const matchedCategories = [];
  const matchedBrands = [];

  categories.forEach((category) => {
    const normalisedCategory = normalizeText(category);

    if (!normalisedCategory) return;

    const exactMatch = text.includes(normalisedCategory);
    const fuzzyMatch = tokens.some(
      (token) => fuzzySimilarity(token, normalisedCategory) >= 0.86
    );

    if (exactMatch || fuzzyMatch) {
      matchedCategories.push(category);
    }
  });

  brands.forEach((brand) => {
    const normalisedBrand = normalizeText(brand);

    if (!normalisedBrand) return;

    const exactMatch = text.includes(normalisedBrand);
    const fuzzyMatch = tokens.some(
      (token) => fuzzySimilarity(token, normalisedBrand) >= 0.88
    );

    if (exactMatch || fuzzyMatch) {
      matchedBrands.push(brand);
    }
  });

  return {
    categories: [...new Set(matchedCategories)],
    brands: [...new Set(matchedBrands)],
  };
};

const analyseMessage = async (message) => {
  const tokens = tokenize(message);
  const expandedTerms = expandQueryTerms(tokens);
  const catalogue = await getCatalogueEntities();
  const entities = detectEntitiesFromCatalogue({
    message,
    categories: catalogue.categories,
    brands: catalogue.brands,
  });

  const { intent, confidence } = classifyIntent(message);

  return {
    raw: message,
    normalised: normalizeText(message),
    tokens,
    expandedTerms,
    intent,
    confidence,
    priceRange: extractPriceRange(message),
    minRating: extractMinimumRating(message),
    requestedLimit: extractRequestedLimit(message),
    sortPreference: detectSortPreference(message),
    useCases: detectUseCase(message),
    stockOnly: /\b(in stock|available|not out of stock)\b/i.test(message),
    entities,
  };
};

const getProductDocument = (product) => {
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const fields = {
    name: normalizeText(product.name),
    category: normalizeText(product.category),
    brand: normalizeText(product.brand),
    description: normalizeText(product.description),
    tags: tags.map((tag) => normalizeText(tag)).join(" "),
  };

  const fullText = Object.values(fields).join(" ");

  return {
    fields,
    fullText,
    tokens: tokenize(fullText),
  };
};

const buildCandidateQuery = (analysis) => {
  const query = {};

  const { minPrice, maxPrice } = analysis.priceRange;

  if (minPrice !== null || maxPrice !== null) {
    query.price = {};

    if (minPrice !== null) {
      query.price.$gte = minPrice;
    }

    if (maxPrice !== null) {
      query.price.$lte = maxPrice;
    }
  }

  if (analysis.minRating !== null) {
    query.rating = { $gte: analysis.minRating };
  }

  if (analysis.stockOnly) {
    query.countInStock = { $gt: 0 };
  }

  const orConditions = [];

  analysis.entities.categories.forEach((category) => {
    orConditions.push({
      category: { $regex: `^${escapeRegex(category)}$`, $options: "i" },
    });
  });

  analysis.entities.brands.forEach((brand) => {
    orConditions.push({
      brand: { $regex: `^${escapeRegex(brand)}$`, $options: "i" },
    });
  });

  analysis.expandedTerms.slice(0, 14).forEach((term) => {
    if (!term || term.length < 2) return;

    const regex = { $regex: escapeRegex(term), $options: "i" };

    orConditions.push({ name: regex });
    orConditions.push({ category: regex });
    orConditions.push({ brand: regex });
    orConditions.push({ tags: regex });
    orConditions.push({ description: regex });
  });

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  return query;
};

const calculateIdfMap = (documents, queryTerms) => {
  const idfMap = {};
  const totalDocuments = documents.length || 1;

  queryTerms.forEach((term) => {
    let documentFrequency = 0;

    documents.forEach((doc) => {
      if (doc.tokens.includes(term)) {
        documentFrequency += 1;
      }
    });

    idfMap[term] = Math.log(
      1 + (totalDocuments - documentFrequency + 0.5) / (documentFrequency + 0.5)
    );
  });

  return idfMap;
};

const calculateBm25FieldScore = ({ fieldText, queryTerms, idfMap, fieldWeight }) => {
  const fieldTokens = tokenize(fieldText);
  const fieldLength = fieldTokens.length || 1;
  const averageFieldLength = 18;

  const k1 = 1.5;
  const b = 0.75;

  let score = 0;

  queryTerms.forEach((term) => {
    const termFrequency = fieldTokens.filter((token) => token === term).length;

    if (termFrequency === 0) return;

    const idf = idfMap[term] || 0.1;

    const numerator = termFrequency * (k1 + 1);
    const denominator =
      termFrequency + k1 * (1 - b + b * (fieldLength / averageFieldLength));

    score += idf * (numerator / denominator) * fieldWeight;
  });

  return score;
};

const getUserPreferenceProfile = async (user) => {
  const profile = {
    categories: new Map(),
    brands: new Map(),
    tags: new Map(),
    terms: new Map(),
  };

  if (!user) return profile;

  if (Array.isArray(user.searchHistory)) {
    user.searchHistory.slice(-CONFIG.SEARCH_HISTORY_LIMIT).forEach((entry, index) => {
      if (!entry.keyword) return;

      const recencyWeight = 1 + index / 15;

      expandQueryTerms(tokenize(entry.keyword)).forEach((term) => {
        profile.terms.set(term, (profile.terms.get(term) || 0) + recencyWeight);
      });
    });
  }

  if (Array.isArray(user.viewedProducts) && user.viewedProducts.length > 0) {
    const viewedProducts = await Product.find({
      _id: { $in: user.viewedProducts },
    })
      .select("category brand tags")
      .limit(CONFIG.VIEWED_PRODUCT_LIMIT);

    viewedProducts.forEach((product) => {
      if (product.category) {
        const category = normalizeText(product.category);
        profile.categories.set(category, (profile.categories.get(category) || 0) + 3);
      }

      if (product.brand) {
        const brand = normalizeText(product.brand);
        profile.brands.set(brand, (profile.brands.get(brand) || 0) + 3);
      }

      if (Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const normalisedTag = normalizeText(tag);
          profile.tags.set(normalisedTag, (profile.tags.get(normalisedTag) || 0) + 1.5);
        });
      }
    });
  }

  return profile;
};

const calculatePriceScore = (product, analysis) => {
  const price = Number(product.price || 0);
  const { minPrice, maxPrice, targetPrice } = analysis.priceRange;

  if (!price) return 0;

  let score = 0;

  if (minPrice !== null && price >= minPrice) {
    score += 8;
  }

  if (maxPrice !== null && price <= maxPrice) {
    score += 14;
  }

  if (targetPrice !== null) {
    const distance = Math.abs(price - targetPrice);
    const closeness = Math.max(0, 1 - distance / targetPrice);
    score += closeness * 16;
  }

  if (analysis.sortPreference === "price_low") {
    score += Math.max(0, 20 - price / 100);
  }

  if (analysis.sortPreference === "price_high") {
    score += Math.min(price / 100, 20);
  }

  return score;
};

const calculateQualityScore = (product, analysis) => {
  const rating = Number(product.rating || 0);
  const reviews = Number(product.numReviews || product.reviews?.length || 0);
  const stock = Number(product.countInStock || 0);

  let score = 0;

  if (stock > 0) {
    score += 12;
    score += Math.min(stock, 30) * 0.25;
  } else {
    score -= 25;
  }

  score += rating * 5;

  if (reviews > 0) {
    score += Math.min(reviews, 80) * 0.25;
  }

  if (analysis.intent === "best_products") {
    score += rating * 8;
    score += Math.min(reviews, 100) * 0.3;
  }

  if (analysis.sortPreference === "rating") {
    score += rating * 8;
  }

  if (analysis.sortPreference === "stock") {
    score += Math.min(stock, 50) * 0.5;
  }

  return score;
};

const calculatePersonalisationScore = (productDoc, userProfile) => {
  let score = 0;

  if (userProfile.categories.has(productDoc.fields.category)) {
    score += userProfile.categories.get(productDoc.fields.category) * 2.5;
  }

  if (userProfile.brands.has(productDoc.fields.brand)) {
    score += userProfile.brands.get(productDoc.fields.brand) * 2.5;
  }

  productDoc.fields.tags.split(" ").forEach((tag) => {
    if (userProfile.tags.has(tag)) {
      score += userProfile.tags.get(tag);
    }
  });

  userProfile.terms.forEach((weight, term) => {
    if (productDoc.fullText.includes(term)) {
      score += weight * 0.7;
    }
  });

  return score;
};

const calculateSemanticScore = (productDoc, analysis) => {
  let score = 0;

  analysis.useCases.forEach((useCase) => {
    const expandedUseCaseTerms = synonymMap[useCase] || [useCase];

    expandedUseCaseTerms.forEach((term) => {
      const normalisedTerm = normalizeText(term);

      if (productDoc.fullText.includes(normalisedTerm)) {
        score += 5;
      }
    });
  });

  return score;
};

const calculateFuzzyScore = (productDoc, analysis) => {
  let score = 0;

  analysis.tokens.forEach((queryToken) => {
    productDoc.tokens.forEach((productToken) => {
      if (queryToken.length < 4 || productToken.length < 4) return;

      const similarity = fuzzySimilarity(queryToken, productToken);

      if (similarity >= 0.88) {
        score += similarity * 3;
      }
    });
  });

  return Math.min(score, 20);
};

const createProductReasons = ({ product, productDoc, scores, analysis }) => {
  const reasons = [];

  const rating = Number(product.rating || 0);
  const reviews = Number(product.numReviews || product.reviews?.length || 0);
  const stock = Number(product.countInStock || 0);

  if (scores.lexicalScore > 8) {
    reasons.push("strong keyword match");
  }

  if (scores.semanticScore > 0) {
    reasons.push("matches your use case");
  }

  if (scores.fuzzyScore > 0) {
    reasons.push("matched even with spelling variation");
  }

  if (
    analysis.entities.categories.some(
      (category) => normalizeText(category) === productDoc.fields.category
    )
  ) {
    reasons.push(`category match: ${product.category}`);
  }

  if (
    analysis.entities.brands.some(
      (brand) => normalizeText(brand) === productDoc.fields.brand
    )
  ) {
    reasons.push(`brand match: ${product.brand}`);
  }

  if (stock > 0) {
    reasons.push(`${stock} in stock`);
  } else {
    reasons.push("currently out of stock");
  }

  if (rating >= 4) {
    reasons.push(`${rating.toFixed(1)}/5 rating`);
  }

  if (reviews > 0) {
    reasons.push(`${reviews} review${reviews === 1 ? "" : "s"}`);
  }

  if (scores.personalisationScore > 4) {
    reasons.push("personalised to your behaviour");
  }

  if (analysis.priceRange.maxPrice !== null) {
    reasons.push(`fits under £${analysis.priceRange.maxPrice}`);
  }

  return [...new Set(reasons)].slice(0, 5).join(" • ");
};

const scoreProducts = async ({ products, analysis, user }) => {
  const userProfile = await getUserPreferenceProfile(user);

  const productDocs = products.map((product) => ({
    product,
    doc: getProductDocument(product),
  }));

  const queryTerms = [...new Set(analysis.expandedTerms)];
  const idfMap = calculateIdfMap(
    productDocs.map((item) => item.doc),
    queryTerms
  );

  return productDocs
    .map(({ product, doc }) => {
      let lexicalScore = 0;

      Object.entries(doc.fields).forEach(([fieldName, fieldText]) => {
        lexicalScore += calculateBm25FieldScore({
          fieldText,
          queryTerms,
          idfMap,
          fieldWeight: FIELD_WEIGHTS[fieldName] || 1,
        });
      });

      analysis.entities.categories.forEach((category) => {
        if (normalizeText(category) === doc.fields.category) {
          lexicalScore += 35;
        }
      });

      analysis.entities.brands.forEach((brand) => {
        if (normalizeText(brand) === doc.fields.brand) {
          lexicalScore += 28;
        }
      });

      const fuzzyScore = calculateFuzzyScore(doc, analysis);
      const semanticScore = calculateSemanticScore(doc, analysis);
      const priceScore = calculatePriceScore(product, analysis);
      const qualityScore = calculateQualityScore(product, analysis);
      const personalisationScore = calculatePersonalisationScore(doc, userProfile);

      const totalScore =
        lexicalScore +
        fuzzyScore +
        semanticScore +
        priceScore +
        qualityScore +
        personalisationScore;

      const scores = {
        lexicalScore: Number(lexicalScore.toFixed(2)),
        fuzzyScore: Number(fuzzyScore.toFixed(2)),
        semanticScore: Number(semanticScore.toFixed(2)),
        priceScore: Number(priceScore.toFixed(2)),
        qualityScore: Number(qualityScore.toFixed(2)),
        personalisationScore: Number(personalisationScore.toFixed(2)),
        totalScore: Number(totalScore.toFixed(2)),
      };

      return {
        product,
        ...scores,
        reason: createProductReasons({
          product,
          productDoc: doc,
          scores,
          analysis,
        }),
      };
    })
    .filter((item) => {
      const hasSearchIntent =
        analysis.expandedTerms.length > 0 ||
        analysis.entities.categories.length > 0 ||
        analysis.entities.brands.length > 0 ||
        analysis.useCases.length > 0;

      if (analysis.intent === "recommendation" || analysis.intent === "best_products") {
        return item.totalScore > 5;
      }

      if (hasSearchIntent) {
        return (
          item.lexicalScore > 0 ||
          item.fuzzyScore > 0 ||
          item.semanticScore > 0
        );
      }

      return item.totalScore > 0;
    });
};

const sortScoredProducts = (items, analysis) => {
  const sorted = [...items];

  if (analysis.sortPreference === "price_low") {
    return sorted.sort(
      (a, b) =>
        Number(a.product.price || 0) - Number(b.product.price || 0)
    );
  }

  if (analysis.sortPreference === "price_high") {
    return sorted.sort(
      (a, b) =>
        Number(b.product.price || 0) - Number(a.product.price || 0)
    );
  }

  if (analysis.sortPreference === "rating") {
    return sorted.sort(
      (a, b) =>
        Number(b.product.rating || 0) - Number(a.product.rating || 0)
    );
  }

  if (analysis.sortPreference === "stock") {
    return sorted.sort(
      (a, b) =>
        Number(b.product.countInStock || 0) -
        Number(a.product.countInStock || 0)
    );
  }

  if (analysis.sortPreference === "newest") {
    return sorted.sort(
      (a, b) =>
        new Date(b.product.createdAt || 0) -
        new Date(a.product.createdAt || 0)
    );
  }

  return sorted.sort((a, b) => b.totalScore - a.totalScore);
};

const findAdvancedProducts = async ({ analysis, user }) => {
  const strictQuery = buildCandidateQuery(analysis);

  let products = await Product.find(strictQuery)
    .sort({ createdAt: -1 })
    .limit(CONFIG.MAX_CANDIDATES);

  if (products.length === 0 && strictQuery.$or) {
    const fallbackQuery = { ...strictQuery };
    delete fallbackQuery.$or;

    products = await Product.find(fallbackQuery)
      .sort({ createdAt: -1 })
      .limit(CONFIG.MAX_CANDIDATES);
  }

  if (products.length === 0) {
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(CONFIG.MAX_CANDIDATES);
  }

  const scoredProducts = await scoreProducts({
    products,
    analysis,
    user,
  });

  return sortScoredProducts(scoredProducts, analysis).slice(
    0,
    analysis.requestedLimit
  );
};

const saveUserSearchHistory = async (user, analysis) => {
  if (!user || analysis.expandedTerms.length === 0) return;

  const searchEntries = analysis.expandedTerms.slice(0, 8).map((keyword) => ({
    keyword,
    searchedAt: new Date(),
  }));

  await User.findByIdAndUpdate(user._id, {
    $push: {
      searchHistory: {
        $each: searchEntries,
        $slice: -CONFIG.SEARCH_HISTORY_LIMIT,
      },
    },
  });
};

const mapProductResponse = (items) => {
  return items.map((item) => {
    const productObject =
      typeof item.product.toObject === "function"
        ? item.product.toObject()
        : item.product;

    return {
      ...productObject,
      aiScore: item.totalScore,
      lexicalScore: item.lexicalScore,
      fuzzyScore: item.fuzzyScore,
      semanticScore: item.semanticScore,
      priceScore: item.priceScore,
      qualityScore: item.qualityScore,
      personalisationScore: item.personalisationScore,
      reason: item.reason,
    };
  });
};

const buildSearchReply = ({ items, analysis }) => {
  const count = items.length;
  const label = count === 1 ? "product" : "products";

  const categoryText =
    analysis.entities.categories.length > 0
      ? ` in ${analysis.entities.categories.join(", ")}`
      : "";

  const brandText =
    analysis.entities.brands.length > 0
      ? ` from ${analysis.entities.brands.join(", ")}`
      : "";

  const priceText =
    analysis.priceRange.minPrice !== null && analysis.priceRange.maxPrice !== null
      ? ` between £${analysis.priceRange.minPrice} and £${analysis.priceRange.maxPrice}`
      : analysis.priceRange.maxPrice !== null
      ? ` under £${analysis.priceRange.maxPrice}`
      : analysis.priceRange.minPrice !== null
      ? ` above £${analysis.priceRange.minPrice}`
      : "";

  const useCaseText =
    analysis.useCases.length > 0
      ? ` for ${analysis.useCases.join(", ")}`
      : "";

  if (analysis.intent === "recommendation") {
    return `I found ${count} personalised ${label}${categoryText}${brandText}${priceText}${useCaseText}. I ranked them using your behaviour, product relevance, stock, rating, reviews, price fit, and semantic meaning.`;
  }

  if (analysis.intent === "best_products") {
    return `I found ${count} top ${label}${categoryText}${brandText}${priceText}${useCaseText}. I prioritised rating, reviews, stock, relevance, and product quality.`;
  }

  return `I found ${count} matching ${label}${categoryText}${brandText}${priceText}${useCaseText}. I used advanced keyword, fuzzy, semantic, category, brand, price, and quality scoring.`;
};

const getLastMatchedProducts = async (user) => {
  if (!user) return [];

  const lastLog = await ChatLog.findOne({
    user: user._id,
    matchedProducts: { $exists: true, $ne: [] },
  })
    .sort({ createdAt: -1 })
    .populate("matchedProducts")
    .limit(1);

  if (!lastLog || !Array.isArray(lastLog.matchedProducts)) {
    return [];
  }

  return lastLog.matchedProducts.filter(Boolean).slice(0, 3);
};

const buildComparisonReply = (products) => {
  if (!products || products.length < 2) {
    return {
      reply:
        "I can compare products, but I need at least two products first. Try asking: “show me laptops under £700”, then say “compare the first two”.",
      products: [],
    };
  }

  const selected = products.slice(0, 3);

  const bestRated = [...selected].sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
  )[0];

  const cheapest = [...selected].sort(
    (a, b) => Number(a.price || 0) - Number(b.price || 0)
  )[0];

  const bestStock = [...selected].sort(
    (a, b) => Number(b.countInStock || 0) - Number(a.countInStock || 0)
  )[0];

  const reply = [
    "Here is an AI-style comparison:",
    "",
    ...selected.map((product, index) => {
      return `${index + 1}. ${product.name} — £${product.price}, ${Number(
        product.rating || 0
      ).toFixed(1)}/5 rating, ${Number(product.countInStock || 0)} in stock.`;
    }),
    "",
    `Best rated: ${bestRated?.name || "N/A"}.`,
    `Best budget choice: ${cheapest?.name || "N/A"}.`,
    `Best availability: ${bestStock?.name || "N/A"}.`,
    "",
    "My recommendation: choose the best-rated product for quality, the cheapest product for budget, or the highest-stock product if availability matters most.",
  ].join("\n");

  return {
    reply,
    products: selected,
  };
};

const buildSuggestions = ({ analysis, items }) => {
  if (analysis.intent === "greeting") {
    return [
      "Show me laptops under £700",
      "Recommend something for me",
      "What categories do you sell?",
    ];
  }

  if (analysis.intent === "categories") {
    return [
      "Show me best products",
      "Show budget products",
      "Recommend products for students",
    ];
  }

  if (items && items.length >= 2) {
    return [
      "Compare the first two",
      "Show cheaper alternatives",
      "Show only top-rated options",
    ];
  }

  return [
    "Show top-rated products",
    "Find budget products",
    "Recommend something personalised",
  ];
};

const handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }

    const userMessage = message.trim();

    if (userMessage.length > CONFIG.MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Message is too long. Please keep it under ${CONFIG.MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    const analysis = await analyseMessage(userMessage);

    let botResponse = "";
    let matchedItems = [];
    let responseProducts = [];

    if (analysis.intent === "greeting") {
      botResponse =
        "Hello! I’m your advanced AI shopping assistant. I can search products, detect categories and brands, understand budgets, fix spelling mistakes, compare products, and recommend items based on your behaviour.";
    } else if (analysis.intent === "categories") {
      const categories = await Product.distinct("category");

      botResponse =
        categories.length === 0
          ? "No categories are available yet."
          : `Available categories are: ${categories.join(
              ", "
            )}. You can ask things like “show me gaming laptops under £700” or “recommend top-rated shoes”.`;
    } else if (analysis.intent === "checkout_help") {
      botResponse =
        "To place an order, add products to your cart, open checkout, enter your delivery details, and confirm the order. Your current system can support Cash on Delivery, and you can later upgrade it with Stripe or PayPal.";
    } else if (analysis.intent === "order_help") {
      botResponse = req.user
        ? "I can help with order support. The next advanced upgrade is connecting me to your Order model so I can fetch your latest order, delivery status, payment status, and order history."
        : "Please log in first so I can help with your order details.";
    } else if (analysis.intent === "compare") {
      matchedItems = await findAdvancedProducts({
        analysis,
        user: req.user,
      });

      let productsToCompare = matchedItems.map((item) => item.product);

      if (productsToCompare.length < 2) {
        productsToCompare = await getLastMatchedProducts(req.user);
      }

      const comparison = buildComparisonReply(productsToCompare);

      botResponse = comparison.reply;
      responseProducts = comparison.products;
    } else {
      matchedItems = await findAdvancedProducts({
        analysis,
        user: req.user,
      });

      await saveUserSearchHistory(req.user, analysis);

      if (matchedItems.length === 0) {
        botResponse =
          "Sorry, I could not find a strong match. Try using another category, brand, product name, or budget range.";
      } else {
        botResponse = buildSearchReply({
          items: matchedItems,
          analysis,
        });
      }

      responseProducts = mapProductResponse(matchedItems);
    }

    await ChatLog.create({
      user: req.user?._id || null,
      message: userMessage,
      response: botResponse,
      intent: analysis.intent,
      matchedProducts: matchedItems
        .map((item) => item.product?._id)
        .filter(Boolean),
    });

    return res.json({
      reply: botResponse,
      intent: analysis.intent,
      confidence: analysis.confidence,
      products: responseProducts,
      suggestions: buildSuggestions({
        analysis,
        items: matchedItems,
      }),
      ai: {
        model: "Hybrid NLP + Naive Bayes Intent + BM25 Product Ranking + Fuzzy Matching",
        detectedTerms: analysis.expandedTerms.slice(0, 12),
        detectedCategories: analysis.entities.categories,
        detectedBrands: analysis.entities.brands,
        detectedUseCases: analysis.useCases,
        priceRange: analysis.priceRange,
        minRating: analysis.minRating,
        sortPreference: analysis.sortPreference,
        stockOnly: analysis.stockOnly,
      },
    });
  } catch (error) {
    console.error("Advanced chatbot error:", error);

    return res.status(500).json({
      message: "Chatbot failed to respond.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = { handleChatbotMessage };