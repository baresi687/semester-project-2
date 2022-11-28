const mainListingImg = document.querySelector('#listing-img-main')
const galleryImgs = document.querySelectorAll('.gallery-img')

galleryImgs.forEach((item) => {
  item.onclick = function (event) {
    mainListingImg.style.backgroundImage = event.target.style.backgroundImage
  }
})
