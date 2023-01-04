import { getListings } from './settings/getListings';
import { API_BASE_URL, GET_LISTINGS } from './settings/api';
import { listingFeedHtml } from './components/listingFeedHtml';
import { showErrorMsg } from './utils/errorMessages';
import { removeLoader } from './components/loader';

const searchInput = document.querySelector('#search');
const searchParam = new URLSearchParams(window.location.search).get('search');
const searchResultsContainer = document.querySelector(
  '#search-results-container'
);
searchInput.value = searchParam;
searchInput.focus();

getListings(API_BASE_URL + GET_LISTINGS, null, 'loader', searchResultsContainer)
  .then((response) => {
    const filteredResponse = response.filter((item) => {
      if (item.description) {
        return (
          item.title.toLowerCase().includes(searchParam.toLowerCase().trim()) ||
          item.description
            .toLowerCase()
            .includes(searchParam.toLowerCase().trim())
        );
      } else {
        return item.title
          .toLowerCase()
          .includes(searchParam.toLowerCase().trim());
      }
    });

    if (filteredResponse.length) {
      const html = listingFeedHtml(filteredResponse);
      searchResultsContainer.innerHTML = html.join(' ');
    } else {
      searchResultsContainer.innerHTML += `<h2 class="text-xl italic font-extralight font-archivo mb-60">No Results Found</h2>`;
    }
  })
  .catch(() => {
    showErrorMsg(document.querySelector('#general-error'));
  })
  .finally(() => {
    removeLoader();
  });
