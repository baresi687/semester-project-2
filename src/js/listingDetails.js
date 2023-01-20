import { API_BASE_URL, GET_LISTING_DETAILS } from './settings/api';
import { getListings } from './settings/getListings';
import listingPlaceholderImg from '../img/placeholder-image.svg';
import { showErrorMsg } from './utils/errorMessages';
import { DateTime } from 'luxon';
import { getFromStorage, saveToStorage } from './utils/storage';
import { buttonProcessing, removeLoader } from './components/loader';
import { handleImgErrors } from './utils/validation';

const now = DateTime.now();
const listingDetails = document.querySelector('#listing-details');
const pageTitle = document.querySelector('title');
const listingID = new URLSearchParams(window.location.search).get('id');
const titleOfListing = document.querySelector('#listing-title');
const listingBidContainerTitle = document.querySelector('#listing-bid-title');
const listingDescription = document.querySelector('#listing-description p');
const currentBid = document.querySelector('#current-bid');
const listingSeller = document.querySelector('#listing-seller');
const timeLeft = document.querySelector('#bid-remaining');
const listingImgMain = document.createElement('img');
const listingImgGallery = document.querySelector('#listing-img-gallery');
const sellerAvatar = document.createElement('img');
const bidListingForm = document.querySelector('#bid-listing-form');
const bidOnListingInput = document.querySelector('#bid-on-listing');
const bidBtn = document.querySelector('#bid-btn');
const accessToken = getFromStorage('accessToken');
const userKey = getFromStorage('userKey');
const bidModal = document.querySelector('#modal');
const bidsMadeOnListing = document.querySelector('#bid-list');

function getListingDetails(elemScrollTo) {
  getListings(
    API_BASE_URL + GET_LISTING_DETAILS + listingID + '?_seller=true&_bids=true',
    null,
    'loader',
    listingDetails
  )
    .then(({ title, media, bids, description, endsAt, seller }) => {
      const capitalizedTitle = title
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ');
      let listingImg = media[0] ? media[0] : listingPlaceholderImg;
      const listingEndsAt = DateTime.fromISO(endsAt);
      const diffObject = listingEndsAt.diff(now, ['days', 'hours', 'minutes']).toObject();
      let timeRemaining = '';
      let isDescription = description ? description : 'No Description';

      pageTitle.innerText = `Norbid - ${capitalizedTitle}`;
      titleOfListing.textContent = title;
      listingImgMain.classList.add('object-cover', 'h-72', 'rounded', 'lg:grow');
      document.querySelector('#listing-img').insertAdjacentElement('afterbegin', listingImgMain);
      listingImgMain.setAttribute('src', listingImg);
      listingImgMain.setAttribute('alt', title);
      listingBidContainerTitle.textContent = title;

      if (media.length > 1) {
        listingImgGallery.innerHTML = '';
        for (let i = 0; i < media.length; i++) {
          if (i > 4) {
            break;
          }
          listingImgGallery.innerHTML += `<img src="${media[i]}" alt="${title}" class="gallery-img w-full object-cover cursor-pointer h-12 rounded lg:h-20">`;
        }

        if (listingImgGallery.childElementCount > 1) {
          document.querySelector('#listing-img').classList.add('gap-4');
        } else {
          listingImgGallery.classList.add('hidden');
        }
      }

      if (accessToken.length && bids.length) {
        bidsMadeOnListing.classList.remove('hidden');
        bidsMadeOnListing.querySelector('#bid-list-details').innerHTML = '';
        const sortedBids = bids.sort((a, b) => a.amount - b.amount);
        sortedBids.reverse().forEach(({ amount, bidderName }) => {
          bidsMadeOnListing.querySelector(
            '#bid-list-details'
          ).innerHTML += `<li class="my-1 w-full"><span class="text-emerald-700 font-semibold">${amount} credits</span> by ${bidderName}</li>`;
        });
      }

      currentBid.textContent = bids.length ? Math.max(...bids.map((bid) => bid.amount)) + ' Credits' : 'NO BIDS';

      for (const property in diffObject) {
        if (diffObject[property] > 0) {
          switch (property) {
            case 'days':
              timeRemaining += `${diffObject[property]}d `;
              break;
            case 'hours':
              timeRemaining += `${diffObject[property]}h `;
              break;
            case 'minutes':
              timeRemaining += `${parseInt(diffObject[property])}min`;
              break;
          }
        } else if (diffObject[property] < 0) {
          timeRemaining = 'BIDDING HAS ENDED';
          document.querySelector('#bid-btn').disabled = true;
        }
      }
      timeLeft.textContent = timeRemaining;

      listingSeller.textContent = seller.name;
      if (seller.avatar) {
        sellerAvatar.classList.add('order-2', 'object-cover', 'rounded-full', 'w-8', 'h-8');
        sellerAvatar.setAttribute('src', seller.avatar);
        sellerAvatar.setAttribute('alt', seller.name);
        sellerAvatar.setAttribute('id', 'seller-avatar');
        listingSeller.insertAdjacentElement('beforebegin', sellerAvatar);
      }

      isDescription === 'No Description' ? listingDescription.classList.add('italic', 'text-gray-400') : null;
      isDescription = isDescription.substring(0, 200);
      isDescription.length === 200 ? (isDescription += ' ...') : null;
      listingDescription.textContent = isDescription;

      accessToken.length ? bidOnListingInput.setAttribute('required', '') : null;

      listingDetails.querySelector('.container').classList.remove('hidden');
      bidModal.classList.remove('hidden');

      bidOnListingInput.onfocus = clearBiddingErrorMsg;
      bidOnListingInput.onkeydown = clearBiddingErrorMsg;

      function clearBiddingErrorMsg() {
        document.querySelector('.bidding-error').classList.add('hidden');
      }
    })
    .catch(() => {
      document.querySelector('#listing-details-container').innerHTML = '';
      titleOfListing.innerHTML = '';
      showErrorMsg(document.querySelector('#general-error'));
    })
    .finally(() => {
      removeLoader();
      document.querySelectorAll('.gallery-img').forEach((img) => {
        img.addEventListener('error', handleImgErrors);
      });
      const galleryImgs = document.querySelectorAll('.gallery-img');
      galleryImgs.forEach((item) => {
        item.onclick = function (event) {
          listingImgMain.src = event.target.src;
        };
      });
      elemScrollTo
        ? document.querySelector('#listing-bid').scrollIntoView({
            block: 'center',
          })
        : null;
    });
}

getListingDetails();

listingImgMain.addEventListener('error', handleImgErrors);
sellerAvatar.addEventListener('error', (event) => event.target.remove());

bidListingForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (accessToken.length) {
    bidBtn.innerHTML = buttonProcessing;
    const postData = { amount: Number(bidOnListingInput.value) };
    bidOnlisting(API_BASE_URL + GET_LISTING_DETAILS + listingID + '/bids', postData);
  } else {
    bidModal.classList.remove('invisible', 'opacity-0');
  }
  bidListingForm.reset();
});

bidModal.querySelector('#close-modal').onclick = function () {
  bidModal.classList.add('invisible', 'opacity-0');
};

async function bidOnlisting(url, postData) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    };
    const response = await fetch(url, options);
    const responseJSON = await response.json();

    if (response.status === 200) {
      userKey.credits = userKey.credits - postData.amount;
      saveToStorage('userKey', userKey);
      getListingDetails('scrollTo');
    } else if (response.status === 400 || response.status === 403) {
      showErrorMsg(document.querySelector('.bidding-error'), responseJSON.errors[0].message);
    } else {
      showErrorMsg(document.querySelector('.bidding-error'));
    }
  } catch (error) {
    showErrorMsg(document.querySelector('.bidding-error'));
  } finally {
    bidBtn.innerHTML = 'Place Bid';
  }
}
