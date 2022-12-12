function showErrorMsg(
  elem,
  message = 'Something went wrong.. please try again later'
) {
  elem.classList.remove('hidden');
  elem.innerHTML = message;
  elem.scrollIntoView({ block: 'center' });
}

export { showErrorMsg };
