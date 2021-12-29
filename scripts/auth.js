import { getJSON, postJSON, newFormData } from './helpers.js';
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) alert('You need to add the credentials');

  const formData = newFormData({ email, password });
  const data = await postJSON('../phps/login.php', formData);
  if (data.result) {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        id_user: data.id_user,
      })
    );
    window.location = '../htmls/main.html';
  } else {
    alert('Incorrect user, try again');
  }
}
window.login = login;

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) alert('You need to add the credentials');

  const formData = newFormData({ email, password });
  const data = await postJSON('../phps/register.php', formData);

  if (data.result) {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        id_user: data.id_user,
      })
    );
    window.location = '../htmls/main.html';
  } else {
    alert('Repeated credentials, try again');
  }
}
window.register = register;

//EVENT LISTENERS
const form = document.querySelector('.login-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

function init() {
  const localUser = window.localStorage.getItem('user');
  if (!localUser) return;
  window.location = '../htmls/main.html';
}

init();
