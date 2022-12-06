import {API_BASE_URL, GET_LISTING_DETAILS} from "./settings/api";
import {getListings} from "./settings/getListings";
import listingPlaceholderImg from "../img/placeholder-image.svg";
import {showErrorMsg} from "./utils/errorMessages";
import {DateTime} from "luxon";
import {getFromStorage} from "./utils/storage";
import {buttonProcessing} from "./components/loader";

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
const bidListingForm = document.querySelector('#bid-listing-form')
const bidOnListingInput = document.querySelector('#bid-on-listing')
const bidBtn = document.querySelector('#bid-btn')
const accessToken = getFromStorage('accessToken')
const bidModal = document.querySelector('#modal')

getListings(API_BASE_URL + GET_LISTING_DETAILS + listingID + '?_seller=true&_bids=true')
  .then(({id, title, media, bids, description, endsAt}) => {
    const listingEndsAt = DateTime.fromISO(endsAt);
    const diffObject = listingEndsAt.diff(now, ['days', 'hours', 'minutes']).toObject();
    let timeRemaining = ''

    for (const property in diffObject) {
      if (diffObject[property] > 0) {
        switch (property) {
          case 'days':
            timeRemaining += `${diffObject[property]} day(s), `
            break;
          case 'hours':
            timeRemaining += `${diffObject[property]} hour(s) & `
            break;
          case 'minutes':
            timeRemaining += `${parseInt(diffObject[property])} ${property}`
            break;
        }
      } else if (diffObject[property] < 0) {
        timeRemaining = 'BIDDING HAS ENDED'
        timeLeft.classList.add('text-red-400')
        document.querySelector('#bid-btn').disabled = true
      }
    }

    let isTitle = title;
    let isDescription = description
    let listingImg = media[0]

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

    accessToken.length ? bidOnListingInput.setAttribute('required', '') : null

    bidListingForm.addEventListener('submit', function (event) {
      event.preventDefault()
      if (accessToken.length) {
        bidBtn.innerHTML = buttonProcessing
        const postData = {amount: Number(bidOnListingInput.value)}
        bidOnlisting(API_BASE_URL+GET_LISTING_DETAILS+id+'/bids', postData)
      } else {
        bidModal.classList.remove('hidden')
      }
    })

    bidOnListingInput.onfocus = function () {
      document.querySelector('.bidding-error').classList.add('hidden')
    }

  })
  .catch(() => {
    document.querySelector('#listing-details-container').innerHTML = ''
    titleOfListing.innerHTML = ''
    showErrorMsg(document.querySelector('#general-error'))
  })
  .finally(() => {
    const galleryImgs = document.querySelectorAll('.gallery-img')
    galleryImgs.forEach((item) => {
      item.onclick = function (event) {
        listingImgMain.style.backgroundImage = event.target.style.backgroundImage
      }
    })
  })

bidModal.querySelector('#close-modal').onclick = function () {
  bidModal.classList.add('hidden')
}

async function bidOnlisting(url, postData) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(postData)
    }
    const response = await fetch(url, options)
    const responseJSON = await response.json()

    if (response.status === 200) {
      location.reload()
    } else if (response.status === 400 || response.status === 403) {
      showErrorMsg(document.querySelector('.bidding-error'), responseJSON.errors[0].message)
    } else {
      showErrorMsg(document.querySelector('.bidding-error'))
    }

  } catch (error) {
    showErrorMsg(document.querySelector('.bidding-error'))

  } finally {
    bidBtn.innerHTML = 'Place Bid'
  }
}
