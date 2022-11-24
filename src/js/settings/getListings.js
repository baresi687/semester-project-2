export async function getListings(url) {
  const response = await fetch(url)
  return await response.json()
}
