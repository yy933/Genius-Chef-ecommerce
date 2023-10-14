const priceRule = (servings, meals) => {
  const totalMeals = servings * meals
  let discountTotal
  switch (true) {
    case (totalMeals >= 25):
      discountTotal = totalMeals * 188
      break
    case (totalMeals >= 17):
      discountTotal = totalMeals * 208
      break
    case (totalMeals >= 9):
      discountTotal = totalMeals * 228
      break
    default:
      discountTotal = totalMeals * 248
      break
  }
  return discountTotal
}

module.exports = priceRule
