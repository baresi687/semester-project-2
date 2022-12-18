import listingPlaceholderImg from '../../img/placeholder-image.svg';

export function listingFeedHtml(arr) {
  return arr.map(({ id, media, title, bids }) => {
    let listingImg = media[0];
    if (!listingImg) {
      listingImg = listingPlaceholderImg;
    }

    let currentBid = 'NO BIDS';
    if (bids.length) {
      const highestBid = Math.max(...bids.map((bid) => bid.amount));
      currentBid = `${highestBid} Credits`;
    }

    let titleOFListing = title.substring(0, 25);
    !titleOFListing ? (titleOFListing = 'No Title') : null;
    titleOFListing.length === 25 ? (titleOFListing += '..') : null;
    let escapedLessThanTitle = titleOFListing.replace(/</g, '&lt');

    return `<a href="listing-details.html?id=${id}" class="group">
              <div class="flex flex-col gap-4">
                <div class="h-64 w-full bg-cover bg-center rounded" style="background-image: url('${listingImg}')"></div>
                <h3 class="text-xl font-medium capitalize">${escapedLessThanTitle}</h3>
                <p>Current Bid: <span class="text-emerald-700 font-bold">${currentBid}</span></p>
                <div class="bg-blue-700 text-white text-center w-full rounded py-2 group-hover:bg-blue-600">View Details</div>                 
              </div>
            </a>`;
  });
}
