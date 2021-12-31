import { newFormData, postJSON } from './helpers.js';
const userId = JSON.parse(window.localStorage.getItem('user')).id_user;
const modal = document.getElementById('myModal');
const stateModal = document.getElementById('myModal2');
const workflowCb = document.getElementById('workflow-cb');

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
  //stateContainer.innerHTML = '';

  statesArray.reverse().forEach((state) => {
    const markup = `
    <div class="state" id="state-${state.id}" data-counter="${state.counter}">
      <header class="state-header">
        <h1>${state.category}</h1>
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
          <div class="state-cards">hola</div>
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
    </div>
    `;
    stateContainer.insertAdjacentHTML('afterbegin', markup);
    const stateElement = document.getElementById(`state-${state.id}`);
    const buttons = stateElement.querySelectorAll('.state-button');

    //contador del state

    //boton izquierdo

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        console.log(stateModal);
        stateModal.style.display = 'block';
        var counter =
          index === 0
            ? stateElement.dataset.counter
            : stateElement.dataset.counter++;
      });
    });
  });
}

// EVENT LISTENERS
const form = document.querySelector('.new-workflow-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

const stateForm = document.querySelector('.new-state-form');
stateForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

workflowCb.addEventListener('change', showWorkflowStates);

function init() {
  getWorkflows();
  toggleModal();
}
init();
