import { newFormData, postJSON } from './helpers.js';
const userId = JSON.parse(window.localStorage.getItem('user')).id_user;
const modal = document.getElementById('myModal');

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
  const workflowCb = document.getElementById('workflow-cb');
  workflowCb.innerHTML = '';
  workflowsArray.forEach((workflow) => {
    const markup = `
    <option value="${workflow.name}">
    ${workflow.name}
    </option>
    `;
    workflowCb.insertAdjacentHTML('afterbegin', markup);
  });
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
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block';
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

// EVENT LISTENERS
const form = document.querySelector('.new-workflow-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

function init() {
  getWorkflows();
  toggleModal();
}
init();
