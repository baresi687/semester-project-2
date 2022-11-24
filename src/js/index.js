import {getListings} from "./settings/getListings";
import {API_BASE_URL, GET_LISTINGS} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";
import listingPlaceholderImg from '../img/placeholder-image.svg'

const listingsContainer = document.querySelector('#listings-container')

getListings(API_BASE_URL + GET_LISTINGS)
  .then(response => {
    const html = response.map(({id, media, title, bids}) => {
      let listingImg = media[0]
      if (!listingImg) {
        listingImg = listingPlaceholderImg
      }
      let currentBid = 'NO BIDS'
      if (bids.length) {
        const highestBid = Math.max(...bids.map(bid => bid.amount))
        currentBid = `${highestBid} Credits`
      }
      return `<a href="listing-details.html?id=${id}">
                <div class="flex flex-col gap-4">
                  <div class="h-64 w-full bg-gray-800 bg-cover bg-center"
                       style="background-image: url(${listingImg})"></div>
                  <h3 class="text-xl font-medium">${title}</h3>
                  <p>Current Bid: <span class="text-emerald-700 font-bold">${currentBid}</span></p>
                  <div class="bg-blue-700 text-white text-center w-full rounded py-2">View Details</div>                 
                </div>
              </a>`
    })
    listingsContainer.innerHTML = html.join(' ')
  })
  .catch(error => {
    showErrorMsg(document.querySelector('#general-error'))
  })
