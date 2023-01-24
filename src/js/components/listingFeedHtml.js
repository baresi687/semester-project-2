import listingPlaceholderImg from '../../img/placeholder-image.svg';

export function listingFeedHtml(arr) {
  return arr
    .filter(({ title }) => title)
    .map(({ id, media, title, bids }) => {
      const listingImg = media[0] ? media[0] : listingPlaceholderImg;
      const titleOfListing = title.replace(/</g, '&lt');
      let currentBid = 'NO BIDS';

      if (bids.length) {
        const highestBid = Math.max(...bids.map((bid) => bid.amount));
        currentBid = `${highestBid} Credits`;
      }

      return `<a href="listing-details.html?id=${id}" class="group">
              <div class="flex flex-col gap-4">
                <img src="${listingImg}" alt="${titleOfListing}" class="object-cover h-72 rounded sm:h-48 lg:h-56">
                <h3 class="text-xl font-medium capitalize whitespace-nowrap overflow-hidden text-ellipsis">${titleOfListing}</h3>
                <p>Current Bid: <span class="text-emerald-700 font-bold">${currentBid}</span></p>
                <div class="bg-blue-700 text-white text-center w-full rounded py-2 group-hover:bg-blue-600">View Details</div>                 
              </div>
            </a>`;
    });
}
