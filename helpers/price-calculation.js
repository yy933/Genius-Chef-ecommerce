const priceRule = (servings, meals) => {
  const totalMeals = servings * meals
  let discountTotal
  if (totalMeals >= 25) {
    discountTotal = totalMeals * 188
  } else if (totalMeals >= 17) {
    discountTotal = totalMeals * 208
  } else if (totalMeals >= 9) {
    discountTotal = totalMeals * 228
  } else {
    discountTotal = totalMeals * 248
  }
  return discountTotal
}

module.exports = priceRule
