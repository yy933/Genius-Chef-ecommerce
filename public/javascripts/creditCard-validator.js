const creditCardNum = document.getElementById('ccnum')
const cardAcceptedWarn = document.getElementById('cardNum-accepted-warning')

const acceptedCreditCards = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
  amex: /^3[47][0-9]{13}$/
}
function validateAcceptedCards (value) {
  // remove all non digit characters
  value = value.replace(/\D/g, '')
  let accepted = false
  // loop through the keys (visa, mastercard, amex, etc.)
  Object.keys(acceptedCreditCards).forEach((key) => {
    const regex = acceptedCreditCards[key]
    if (regex.test(value)) {
      accepted = true
    }
  })
  return accepted
}

function acceptedWarning () {
  if (!validateAcceptedCards(creditCardNum.value)) {
    cardAcceptedWarn.innerText = 'Card number not valid. Please try again.'
  }
}

creditCardNum.addEventListener('keyup', acceptedWarning)
