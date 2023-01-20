import { clearFormErrorsOnKeyUp } from '../utils/validation';

function createImginput(elem, inputs = 'form .input-val', errorElem = '#general-error') {
  const imageInputs = document.querySelectorAll('.input-val');
  const imageId = imageInputs.length + 1;
  if (imageInputs.length < 5) {
    let divContainer = document.createElement('div');
    divContainer.classList.add('flex', 'flex-col', 'gap-2', 'opt-img', 'mt-2');

    let labelImg = document.createElement('label');
    labelImg.setAttribute('for', `item-img-${imageId}`);
    labelImg.classList.add('flex', 'flex-row', 'flex-wrap', 'gap-2');

    let spanRemove = document.createElement('span');
    spanRemove.classList.add(
      'remove-input',
      'order-2',
      'flex',
      'items-center',
      'justify-center',
      'w-8',
      'h-8',
      'bg-amber-400',
      'text-xl',
      'cursor-pointer',
      'rounded'
    );
    spanRemove.innerHTML = '<span>-</span>';

    let inputImg = document.createElement('input');
    inputImg.id = `item-img-${imageId}`;
    inputImg.setAttribute('type', 'text');
    inputImg.setAttribute('placeholder', 'Image URL');
    inputImg.classList.add(
      'optional-img',
      'input-val',
      'bg-zinc-100',
      'rounded',
      'indent-2.5',
      'h-8',
      'order-1',
      'flex-1',
      'w-full'
    );

    let inputError = document.createElement('span');
    inputError.classList.add('hidden', 'order-3', 'validation-error', 'text-rose-700', 'py-1.5');
    inputError.textContent = 'Image URL must have an image ending (eg .jpg .gif .png etc)';

    labelImg.append(spanRemove, inputImg, inputError);

    divContainer.append(labelImg);

    elem.insertAdjacentElement('beforeend', divContainer);
  }
  document.querySelectorAll('.remove-input').forEach((item) => {
    item.onclick = function () {
      removeImgInput(this.parentNode.parentElement);
    };
  });
  clearFormErrorsOnKeyUp(inputs, errorElem);
}

function removeImgInput(elem) {
  elem.remove();
}

export { createImginput, removeImgInput };
