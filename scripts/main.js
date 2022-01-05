import { newFormData, postJSON } from './helpers.js';
import { newCardMarkup, newCardListeners, movedCard } from './cards.js';
import { readWorkflow, pause, resume } from './textToSpeech.js';

const userId = JSON.parse(window.localStorage.getItem('user')).id_user;
const modal = document.getElementById('myModal');
const stateModal = document.getElementById('myModal2');
export const workflowCb = document.getElementById('workflow-cb');

//new state info
let counter;

function logout() {
  window.localStorage.removeItem('user');
  window.location = '../htmls/index.html';
}
window.logout = logout;

async function getWorkflows() {
  const id = userId;
  const formData = newFormData({ id });
  const workflowsArray = await postJSON(
    '../phps/workflows/getWorkflows.php',
    formData
  );
  workflowCb.innerHTML = '';
  workflowsArray.forEach((workflow) => {
    const markup = `
    <option value="${workflow.name}" data-id=${workflow.id}>
    ${workflow.name}
    </option>
    `;
    workflowCb.insertAdjacentHTML('afterbegin', markup);
  });

  showWorkflowStates();
}

async function addWorkflow() {
  const workflowName = document.getElementById('new-workflow-name').value;
  const workflowDescription = document.getElementById(
    'new-workflow-description'
  ).value;

  if (!workflowName || !workflowDescription)
    alert('You need to add the data of the workflow');

  const formData = newFormData({
    id_user: userId,
    name: workflowName,
    description: workflowDescription,
  });
  const data = await postJSON('../phps/workflows/addWorkflow.php', formData);
  if (data.result) {
    alert('Workflow agregado correctamente');
  }
  getWorkflows();
  modal.style.display = 'none';
}
window.addWorkflow = addWorkflow;

function toggleModal() {
  const btn = document.getElementById('new-workflow');

  const span = document.getElementsByClassName('close');

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block';
  };

  // When the user clicks on <span> (x), close the modal
  span[0].onclick = function () {
    modal.style.display = 'none';
  };
  span[1].onclick = function () {
    stateModal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
    if (event.target == stateModal) {
      stateModal.style.display = 'none';
    }
  };
}

async function showWorkflowStates() {
  const id_workflow = workflowCb.options[workflowCb.selectedIndex]?.dataset.id;

  const formData = newFormData({ id_workflow });
  const statesArray = await postJSON('../phps/states/getStates.php', formData);

  const stateContainer = document.querySelector('.state-container');
  stateContainer.innerHTML = '';

  statesArray.reverse().forEach((state) => {
    const markup = `
    <div class="state" id="${state.id}" data-counter="${state.counter}">
      <header class="state-header">
        <h3 class="state-category" contenteditable>${state.category}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" class="delete-btn state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </header>
      <section class="state-body">
          <div class="state-buttons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="state-button"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div class="state-cards"></div>
          <div class="state-buttons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="state-button"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </section>
        <footer class="state-footer">
          <button class="btn-addCard">NEW Card</button>
        </footer>
    </div>
    `;
    stateContainer.insertAdjacentHTML('afterbegin', markup);
    const stateElement = document.getElementById(`${state.id}`);

    //listeners add state buttons
    const buttons = stateElement.querySelectorAll('.state-button');
    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        stateModal.style.display = 'block';
        counter =
          index === 0
            ? stateElement.dataset.counter
            : ++stateElement.dataset.counter;
      });
    });

    //listener delete state
    const deleteStateBtn = stateElement.querySelector('.delete-btn');
    deleteStateBtn.addEventListener('click', async () => {
      if (stateElement.parentElement.childElementCount === 1) {
        alert('Workflows must have at least one state');
      } else {
        const formData = newFormData({ id_state: state.id });
        await postJSON('../phps/states/deleteState.php', formData);
        stateElement.remove();
      }
    });

    //listener change.
    const categoryTitle = stateElement.querySelector('.state-category');
    categoryTitle.addEventListener(
      'focusout',
      function () {
        alert('Saved correctly');
      },
      false
    );

    //listener ondragenter
    stateElement.addEventListener('dragenter', (e) => {
      stateElement.classList.add('over');
    });

    stateElement.addEventListener('dragleave', (e) => { });
    stateElement.addEventListener('dragover', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }

      return false;
    });

    stateElement.addEventListener('drop', (e) => {
      const container = e.target.closest('.state');
      movedCard.style.opacity = '1';
      if (!container) return;
      const stateCards = stateElement.querySelector('.state-cards');
      stateCards.insertAdjacentElement('afterbegin', movedCard);
      e.stopPropagation();
      return false;
    });

    //add Card btn.
    const addCardBtn = stateElement.querySelector('.btn-addCard');
    addCardBtn.addEventListener('click', () => {
      addCard(stateElement);
    });

    showStateCards(state.id);
  });
}

async function showStateCards(id_state) {
  const stateCardElement = document
    .getElementById(id_state)
    .querySelector('.state-cards');
  const formData = newFormData({ id_state });
  const data = await postJSON('../phps/cards/getCards.php', formData);
  data.forEach(({ id, text }) => {
    const markup = newCardMarkup(id, text);
    stateCardElement.insertAdjacentHTML('afterbegin', markup);
    const card = stateCardElement.querySelector('.card');
    newCardListeners(card);
  });
}

async function addCard(stateElement) {
  const stateCardsElement = stateElement.querySelector('.state-cards');
  const id_state = stateElement.id;
  const text = `TYPE TEXT HERE`;

  const formData = newFormData({ id_state, text });
  const { id_card: id, result } = await postJSON(
    '../phps/cards/addCard.php',
    formData
  );
  if (!result) return;

  const markup = newCardMarkup(id, text);
  stateCardsElement.insertAdjacentHTML('afterbegin', markup);
}

// EVENT LISTENERS
const form = document.querySelector('.new-workflow-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

const stateForm = document.querySelector('.new-state-form');
stateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id_workflow = workflowCb.options[workflowCb.selectedIndex]?.dataset.id;
  const category = document.getElementById('new-state-category').value;
  const formData = newFormData({ id_workflow, category, counter });
  await postJSON('../phps/states/addState.php', formData);
  stateModal.style.display = 'none';
  showWorkflowStates();
});

workflowCb.addEventListener('change', showWorkflowStates);

function init() {
  getWorkflows();
  toggleModal();
  window.readWorkflow = readWorkflow;
  window.pause = pause;
  window.resume = resume;
}
init();
