import {addLoader} from "../components/loader";

export async function getListings(url, options, loader, loaderElem) {
  loader ? addLoader(loaderElem) : null
  const response = await fetch(url, options)
  return await response.json()
}
