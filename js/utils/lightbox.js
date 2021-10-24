function showModal(modalElement) {
  // make sure bootstrap script is loaded
  if (!bootstrap || !bootstrap.Modal) return

  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  // prevent duplicated registration
  const registerMap = {}
  if (registerMap[modalId]) return

  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // selectors
  const imageElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  // lightbox vars
  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    if (index < 0 || index >= imgList.length) return

    const img = imgList[index]
    imageElement.src = img.src
  }

  // Event delegation: handle img click
  document.addEventListener('click', (event) => {
    // Only catch img with data-album attr
    const target = event.target
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    // query all img with the same dataset.album
    // determine the index of selected img
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)

    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })

  // add prev / next click event
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  // mark this modalId as registered
  registerMap[modalId] = true
}
