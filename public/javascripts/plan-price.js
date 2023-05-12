const servings = document.querySelector('.servings')
const meals = document.querySelector('.meals')
const totalAmount = document.getElementById('total-amount')
const pricePerMeal = document.getElementById('price-per-meal')

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
  pricePerMeal.textContent = singleMealPrice
}
document.querySelector('.servings').addEventListener('change', calculateTotal)
document.querySelector('.meals').addEventListener('change', calculateTotal)
