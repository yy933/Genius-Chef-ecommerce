const submitBtn = document.querySelector('button[type="submit"]')
const loadingModal = new bootstrap.Modal(document.getElementById('loading-modal'), {})

function popupModal () {
  return loadingModal.show()
}

submitBtn.addEventListener('click', popupModal)
