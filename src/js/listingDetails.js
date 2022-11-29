import {API_BASE_URL, GET_LISTING_DETAILS} from "./settings/api";
import {getListings} from "./settings/getListings";
import listingPlaceholderImg from "../img/placeholder-image.svg";
import {showErrorMsg} from "./utils/errorMessages";
import {DateTime} from "luxon";

const now = DateTime.now()
const pageTitle = document.querySelector('title')
const listingID = new URLSearchParams(window.location.search).get('id')
const titleOfListing = document.querySelector('#listing-title')
const listingBidContainerTitle = document.querySelector('#listing-bid-title')
const listingDescription = document.querySelector('#listing-description p')
const currentBid = document.querySelector('#current-bid')
const timeLeft = document.querySelector('#bid-remaining')
const listingImgMain = document.querySelector('#listing-img-main')
const listingImgGallery = document.querySelector('#listing-img-gallery')

getListings(API_BASE_URL + GET_LISTING_DETAILS + listingID + '?_seller=true&_bids=true')
  .then(({title, media, bids, description, endsAt}) => {
    const listingEndsAt = DateTime.fromISO(endsAt);
    const diffInDays = listingEndsAt.diff(now, ['days', 'hours', "minutes"]).toObject();
    const {days, hours, minutes} = diffInDays
    let timeRemaining = `${days} days, ${hours} hours & ${parseInt(minutes)} minutes`

    let isTitle = title
    let isDescription = description
    let listingImg = media[0]

    if (days < 0 || hours < 0 || minutes < 0) {
      timeRemaining = 'BIDDING HAS ENDED'
      timeLeft.classList.add('text-red-400')
      document.querySelector('#bid-btn').disabled = true
    }

    !isTitle ? isTitle = 'No Title' : null
    !isDescription ? isDescription = 'No Description' : null
    !listingImg ? listingImg = listingPlaceholderImg : null

    pageTitle.innerText = `Norbid - ${isTitle}`
    timeLeft.textContent = timeRemaining
    titleOfListing.textContent = isTitle
    listingDescription.textContent = isDescription
    listingBidContainerTitle.textContent = isTitle
    listingImgMain.style.backgroundImage = `url(${listingImg})`
    currentBid.textContent = 'NO BIDS'

    if (bids.length) {
      const highestBid = Math.max(...bids.map(bid => bid.amount))
      currentBid.textContent = `${highestBid} Credits`
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