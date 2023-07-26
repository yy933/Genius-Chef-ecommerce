const submitBtn = document.querySelector('button[type="submit"]')
const loadingModal = new bootstrap.Modal(document.getElementById('loading-modal'), {})
function disableBtn () {
  return submitBtn.classList.add('disabled')
}

function popupModal () {
  return loadingModal.show()
}

submitBtn.addEventListener('click', disableBtn)
submitBtn.addEventListener('click', popupModal)
