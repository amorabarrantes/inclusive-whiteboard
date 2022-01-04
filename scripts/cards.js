import { newFormData, postJSON } from './helpers.js';

// VARIABLES
export let movedCard;

// FUNCTIONS
export function newCardMarkup(id, text) {
  return `
  <div class="card" data-id=${id} id=${id} draggable="true">
          <p class="card-text">${text}</p>
          <footer>
            <input type="color"></>
          </footer>
          <svg xmlns="http://www.w3.org/2000/svg" class="delete-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
  `;
}

export function newCardListeners(cardEl) {
  const cardEditBtn = cardEl.querySelector('.delete-card-icon');
  const cardTextEl = cardEl.querySelector('.card-text');
  let oldText;
  //EDIT CARD HANDLER
  const editCardHandler = () => {
    cardEditBtn.classList.add('card-edit-active');
    cardTextEl.contentEditable = 'true';
    cardTextEl.focus();
    oldText = cardTextEl.innerHTML.trim();
  };

  //SAVE EDIT HANDLER
  const finishEditHandler = async (e) => {
    cardEditBtn.classList.remove('card-edit-active');

    // We make it not editable in order to edit only with the edit button
    cardTextEl.contentEditable = 'false';

    // If the text is different from what it was before, then update it in the database
    console.log(oldText, e.target.innerHTML.trim());
    if (oldText !== e.target.innerHTML.trim()) {
      console.log('si llega');
      const id_card = cardEl.dataset.id;
      const text = e.target.innerHTML.trim();
      const formData = newFormData({ id_card, text });
      await postJSON('../phps/cards/editCard.php', formData);
    }
  };

  // DRAG CARD HANDLER
  const dragStartHandler = () => {
    movedCard = cardEl;
  };

  // ADDING LISTENERS
  cardEl.addEventListener('dragstart', dragStartHandler);
  cardEditBtn.addEventListener('click', editCardHandler);
  cardTextEl.addEventListener('focusout', finishEditHandler);
}
