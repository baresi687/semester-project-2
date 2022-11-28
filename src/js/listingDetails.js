import {API_BASE_URL, GET_LISTING_DETAILS} from "./settings/api";
import {getListings} from "./settings/getListings";
import listingPlaceholderImg from "../img/placeholder-image.svg";
import {showErrorMsg} from "./utils/errorMessages";

const listingID = new URLSearchParams(window.location.search).get('id')
const titleOfListing = document.querySelector('#listing-title')
const listingBidContainerTitle = document.querySelector('#listing-bid-title')
const listingDescription = document.querySelector('#listing-description p')
const currentBid = document.querySelector('#current-bid')
const listingImgMain = document.querySelector('#listing-img-main')
const listingImgGallery = document.querySelector('#listing-img-gallery')

getListings(API_BASE_URL + GET_LISTING_DETAILS + listingID + '?_seller=true&_bids=true')
  .then(({title, media, bids, description}) => {
    let isTitle = title
    let isDescription = description
    let listingImg = media[0]

    !isTitle ? isTitle = 'No Title' : null
    !isDescription ? isDescription = 'No Description' : null
    !listingImg ? listingImg = listingPlaceholderImg : null

    titleOfListing.innerText = isTitle
    listingDescription.innerText = isDescription
    listingBidContainerTitle.innerText = isTitle
    listingImgMain.style.backgroundImage = `url(${listingImg})`

    currentBid.innerText = 'NO BIDS'
    if (bids.length) {
      const highestBid = Math.max(...bids.map(bid => bid.amount))
      currentBid.innerText = `${highestBid} Credits`
    }
    if (media.length > 1) {
      media.forEach(item => {
        listingImgGallery.innerHTML +=
          `<div class="gallery-img cursor-pointer h-14 w-full bg-gray-800 bg-cover bg-top lg:h-20"
                style="background-image: url(${item})"></div>`
      })
    }
  })
  .catch(error => {
    document.querySelector('#listing-details-container').innerHTML = ''
    titleOfListing.innerHTML = ''
    showErrorMsg(document.querySelector('#general-error'))
  })
  .finally(item => {
    const galleryImgs = document.querySelectorAll('.gallery-img')
    galleryImgs.forEach((item) => {
      item.onclick = function (event) {
        listingImgMain.style.backgroundImage = event.target.style.backgroundImage
      }
    })
  })
