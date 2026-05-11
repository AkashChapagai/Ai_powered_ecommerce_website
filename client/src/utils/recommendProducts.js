export function getRecommendedProducts(currentProduct, products) {
  if (!currentProduct) return [];

  const scoredProducts = products
    .filter((product) => product.id !== currentProduct.id)
    .map((product) => {
      let score = 0;

      if (product.category === currentProduct.category) {
        score += 5;
      }

      if (product.brand === currentProduct.brand) {
        score += 3;
      }

      const priceDifference = Math.abs(product.price - currentProduct.price);

      if (priceDifference <= 100) {
        score += 2;
      }

      const matchingTags = product.tags?.filter((tag) =>
        currentProduct.tags?.includes(tag)
      );

      score += matchingTags.length * 4;

      return {
        ...product,
        recommendationScore: score,
      };
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  return scoredProducts.slice(0, 3);
}