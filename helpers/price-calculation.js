const priceRule = (servings, meals) => {
  const totalMeals = servings * meals
  let discountTotal
  if (totalMeals >= 25) {
    discountTotal = totalMeals * 7.99
  } else if (totalMeals >= 17) {
    discountTotal = totalMeals * 8.29
  } else if (totalMeals >= 9) {
    discountTotal = totalMeals * 8.49
  } else {
    discountTotal = totalMeals * 8.99
  }
  return discountTotal.toFixed(2)
}

module.exports = priceRule