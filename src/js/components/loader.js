const buttonProcessing = `<svg id="form-loader" class="absolute top-2.5 left-1 rounded-full border-4 border-slate-400 border-t-slate-100 animate-spin h-5 w-5 ml-3  ..." viewBox="0 0 24 24"></svg>Processing...`;

function addLoader(elem) {
  const loader = `
   <div id="loader" class="flex justify-center">
     <svg class="rounded-full border-4 border-slate-200 border-t-slate-700 animate-spin h-8 w-8 mr-6 ..." viewBox="0 0 24 24"></svg>     
   </div>`;
  elem.insertAdjacentHTML('beforebegin', loader);
}

function removeLoader() {
  document.querySelector('#loader').remove();
}

export { buttonProcessing, addLoader, removeLoader };
