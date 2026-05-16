const Product = require("../models/Product");
const ChatLog = require("../models/ChatLog");

const stopWords = [
  "show",
  "me",
  "find",
  "product",
  "products",
  "item",
  "items",
  "please",
  "want",
  "need",
  "have",
  "has",
  "with",
  "for",
  "the",
  "and",
  "under",
  "below",
  "less",
  "than",
  "upto",
  "up",
  "to",
  "pound",
  "pounds",
  "gbp",
];

const extractMaxPrice = (message) => {
  const priceMatch = message.match(
    /(?:under|below|less than|up to|upto|budget)\s*£?\s*(\d+(\.\d+)?)/i
  );

  if (!priceMatch) {
    return null;
  }

  return Number(priceMatch[1]);
};

const getSearchTerms = (message) => {
  return message
    .toLowerCase()
    .replace(/£?\d+(\.\d+)?/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));
};

const formatProductList = (products) => {
  return products
    .map((product, index) => {
      const stockText =
        product.countInStock > 0
          ? `${product.countInStock} in stock`
          : "out of stock";

      return `${index + 1}. ${product.name} - £${Number(product.price).toFixed(
        2
      )} (${product.category}, ${stockText})`;
    })
    .join("\n");
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
    const lowerMessage = userMessage.toLowerCase();

    let botResponse = "";
    let intent = "general";
    let matchedProducts = [];

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      intent = "greeting";
      botResponse =
        "Hello! I can help you find products, check categories, suggest items by budget, and explain checkout.";
    } else if (
      lowerMessage.includes("category") ||
      lowerMessage.includes("categories")
    ) {
      intent = "categories";

      const categories = await Product.distinct("category");

      if (categories.length === 0) {
        botResponse = "No categories are available yet.";
      } else {
        botResponse = `Available categories are: ${categories.join(", ")}.`;
      }
    } else if (
      lowerMessage.includes("checkout") ||
      lowerMessage.includes("order") ||
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("payment")
    ) {
      intent = "checkout_help";
      botResponse =
        "To place an order, add products to your cart, go to checkout, enter your delivery details, and click Place Order. Current payment method is Cash on Delivery.";
    } else {
      intent = "product_search";

      const maxPrice = extractMaxPrice(userMessage);
      const searchTerms = getSearchTerms(userMessage);

      const products = await Product.find({}).sort({ createdAt: -1 });

      matchedProducts = products
        .map((product) => {
          const searchableText = [
            product.name,
            product.brand,
            product.category,
            product.description,
            ...(product.tags || []),
          ]
            .join(" ")
            .toLowerCase();

          let score = 0;

          searchTerms.forEach((term) => {
            if (searchableText.includes(term)) score += 3;
            if (product.name.toLowerCase().includes(term)) score += 5;
            if (product.category.toLowerCase().includes(term)) score += 4;
            if (product.brand.toLowerCase().includes(term)) score += 4;
          });

          if (
            lowerMessage.includes("stock") ||
            lowerMessage.includes("available")
          ) {
            if (product.countInStock > 0) score += 2;
          }

          return { product, score };
        })
        .filter(({ product, score }) => {
          const priceMatches =
            maxPrice === null || Number(product.price) <= maxPrice;

          if (searchTerms.length === 0 && maxPrice !== null) {
            return priceMatches;
          }

          return score > 0 && priceMatches;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.product);

      if (matchedProducts.length === 0) {
        botResponse =
          "Sorry, I could not find matching products. Try asking: 'show me shoes', 'Nike products', or 'products under £100'.";
      } else {
        const intro =
          maxPrice !== null
            ? `Here are some matching products under £${maxPrice}:`
            : "Here are some matching products I found:";

        botResponse = `${intro}\n${formatProductList(matchedProducts)}`;
      }
    }

    await ChatLog.create({
      user: req.user?._id || null,
      message: userMessage,
      response: botResponse,
      intent,
      matchedProducts: matchedProducts.map((product) => product._id),
    });

    return res.json({
      reply: botResponse,
      intent,
      products: matchedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Chatbot failed to respond.",
      error: error.message,
    });
  }
};

module.exports = {
  handleChatbotMessage,
};