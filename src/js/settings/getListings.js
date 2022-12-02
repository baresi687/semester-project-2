export async function getListings(url, options) {
  const response = await fetch(url, options)
  return await response.json()
}
