const servings = document.querySelector('.servings')
const meals = document.querySelector('.meals')
const totalAmount = document.getElementById('total-amount')
const pricePerMeal = document.getElementById('price-per-meal')

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

function calculateTotal () {
  const discountTotal = priceRule(servings.value, meals.value)
  const singleMealPrice = discountTotal / (meals.value * servings.value)
  totalAmount.textContent = discountTotal
  totalAmount.value = discountTotal
  pricePerMeal.textContent = singleMealPrice
}

servings.addEventListener('change', calculateTotal)
meals.addEventListener('change', calculateTotal)
