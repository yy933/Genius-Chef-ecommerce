const submitBtn = document.querySelector('button[type="submit"]')

function disableBtn () {
  return submitBtn.classList.add('disabled')
}

submitBtn.addEventListener('click', disableBtn)
