const servings = document.querySelector('.servings')
const meals = document.querySelector('.meals')
const totalAmount = document.getElementById('total-amount')
const pricePerMeal = document.getElementById('price-per-meal')
const mealTotal = document.getElementById('meal-total')

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

function calculateTotal () {
  const discountTotal = priceRule(servings.value, meals.value)
  const singleMealPrice = discountTotal / (meals.value * servings.value)
  totalAmount.textContent = discountTotal
  mealTotal.value = discountTotal
  pricePerMeal.textContent = singleMealPrice.toFixed(2)
}

servings.addEventListener('change', calculateTotal)
meals.addEventListener('change', calculateTotal)
