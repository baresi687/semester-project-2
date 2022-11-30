function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getFromStorage(key) {
  return (localStorage.getItem(key) ?
      JSON.parse(localStorage.getItem(key)) : [])
}

function clearStorage() {
  localStorage.clear()
  window.location.replace('/sign-in.html')
}

export {saveToStorage, clearStorage, getFromStorage}
