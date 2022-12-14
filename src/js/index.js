import { getListings } from './settings/getListings';
import { API_BASE_URL, GET_LISTINGS } from './settings/api';
import { showErrorMsg } from './utils/errorMessages';
import { listingFeedHtml } from './components/listingFeedHtml';
import { removeLoader } from './components/loader';

const listingsContainer = document.querySelector('#listings-container');

getListings(API_BASE_URL + GET_LISTINGS, null, 'loader', listingsContainer)
  .then((response) => {
    const html = listingFeedHtml(response);
    listingsContainer.innerHTML = html.join(' ');
  })
  .catch(() => {
    showErrorMsg(document.querySelector('#general-error'));
  })
  .finally(() => {
    removeLoader();
  });
