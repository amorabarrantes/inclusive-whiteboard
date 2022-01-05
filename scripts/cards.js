import { newFormData, postJSON } from './helpers.js';

// VARIABLES
export let movedCard;
let oldColor;

// FUNCTIONS
export function newCardMarkup(id, text, color) {
  return `
  <div class="card" style="background-color:${color} "data-id=${id} id=${id} draggable="true">
          <p class="card-text">${text}</p>
          <footer>
            <input class="color-input" type="color" value=${color}></>
          </footer>
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" class="delete-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
  `;
}

export function newCardListeners(cardEl) {
  const cardEditBtn = cardEl.querySelector('.edit-card-icon');
  const cardDeleteBtn = cardEl.querySelector('.delete-card-icon');
  const cardTextEl = cardEl.querySelector('.card-text');
  const colorInputEl = cardEl.querySelector('.color-input');
  let oldText;
  //EDIT CARD HANDLER

  const editCardHandler = () => {
    cardEditBtn.classList.add('card-edit-active');
    cardTextEl.contentEditable = 'true';
    cardTextEl.focus();
    oldText = cardTextEl.innerHTML.trim();
    cardTextEl.innerHTML = '';
  };

  const deleteCardHandler = async () => {
    const id_card = cardEl.dataset.id;
    const formData = newFormData({ id_card });
    await postJSON('../phps/cards/deleteCard.php', formData);
    cardEl.remove();
  };

  //SAVE EDIT HANDLER
  const finishEditHandler = async (e) => {
    cardEditBtn.classList.remove('card-edit-active');

    // We make it not editable in order to edit only with the edit button
    cardTextEl.contentEditable = 'false';
    // If the text is different from what it was before, then update it in the database
    if (
      (oldText !== e.target.innerHTML.trim() &&
        e.target.innerHTML.trim() !== '') ||
      oldColor !== colorInputEl.value
    ) {
      const id_card = cardEl.dataset.id;
      const text = cardTextEl.innerHTML.trim();

      console.log(id_card, text, colorInputEl.value);
      const formData = newFormData({
        id_card,
        text,
        color: colorInputEl.value,
      });
      const data = await postJSON('../phps/cards/editCard.php', formData);
    } else {
      e.target.innerHTML = oldText;
    }
  };

  const colorChangeHandler = (e) => {
    const color = colorInputEl.value;
    cardEl.style.backgroundColor = color;
    finishEditHandler(e);
  };

  const saveOldColor = () => {
    oldColor = colorInputEl.value;
    oldText = cardTextEl.innerHTML.trim();
  };
  // DRAG CARD HANDLER
  const dragStartHandler = () => {
    movedCard = cardEl;
  };

  // ADDING LISTENERS
  cardEl.addEventListener('dragstart', dragStartHandler);
  cardEditBtn.addEventListener('click', editCardHandler);
  cardDeleteBtn.addEventListener('click', deleteCardHandler);
  cardTextEl.addEventListener('focusout', finishEditHandler);
  colorInputEl.addEventListener('change', colorChangeHandler);
  colorInputEl.addEventListener('click', saveOldColor);
}
