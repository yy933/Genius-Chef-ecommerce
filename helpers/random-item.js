// Get a random item in an array
const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

module.exports = randomItem
