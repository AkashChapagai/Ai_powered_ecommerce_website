export function getRecommendedProducts(currentProduct, allProducts) {
  if (!currentProduct || !allProducts || allProducts.length === 0) {
    return [];
  }

  const currentProductId = currentProduct._id || currentProduct.id;

  const scoredProducts = allProducts
    .filter((product) => {
      const productId = product._id || product.id;
      return productId !== currentProductId;
    })
    .map((product) => {
      let score = 0;

      // Same category = strongest match
      if (
        product.category &&
        currentProduct.category &&
        product.category.toLowerCase() === currentProduct.category.toLowerCase()
      ) {
        score += 5;
      }

      // Same brand = useful match
      if (
        product.brand &&
        currentProduct.brand &&
        product.brand.toLowerCase() === currentProduct.brand.toLowerCase()
      ) {
        score += 3;
      }

      // Similar price = useful match
      const priceDifference = Math.abs(
        Number(product.price) - Number(currentProduct.price)
      );

      if (priceDifference <= 20) {
        score += 2;
      } else if (priceDifference <= 50) {
        score += 1;
      }

      // Matching tags = extra similarity
      if (Array.isArray(product.tags) && Array.isArray(currentProduct.tags)) {
        const currentTags = currentProduct.tags.map((tag) =>
          tag.toLowerCase()
        );

        const matchingTags = product.tags.filter((tag) =>
          currentTags.includes(tag.toLowerCase())
        );

        score += matchingTags.length * 2;
      }

      return {
        ...product,
        recommendationScore: score,
      };
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 4);

  return scoredProducts;
}