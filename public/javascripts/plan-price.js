const servings = document.querySelector('.servings')
const meals = document.querySelector('.meals')
const totalAmount = document.getElementById('total-amount')
const pricePerMeal = document.getElementById('price-per-meal')
const mealTotal = document.getElementById('meal-total')
function calculateTotal () {
  let singleMealPrice
  const totalMeals = servings.value * meals.value
  if (totalMeals >= 25) {
    singleMealPrice = 7.99
  } else if (totalMeals >= 17) {
    singleMealPrice = 8.29
  } else if (totalMeals >= 9) {
    singleMealPrice = 8.49
  } else {
    singleMealPrice = 8.99
  }
  const total = (singleMealPrice * totalMeals).toFixed(2)
  totalAmount.textContent = total
  mealTotal.value = total
  pricePerMeal.textContent = singleMealPrice
}
servings.addEventListener('change', calculateTotal)
meals.addEventListener('change', calculateTotal)
