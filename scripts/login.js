import { getJSON, postJSON, newFormData } from './helpers.js';

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) alert('Necesita ingresar las credenciales');

  const formData = newFormData({ email, password });
  const data = await postJSON('../phps/login.php', formData);
}
window.login = login;

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) alert('Necesita ingresar las credenciales');

  const formData = newFormData({ email, password });
  const data = await postJSON('../phps/register.php', formData);
  alert('Usuario creado correctamente, ya puede iniciar sesion con el mismo');
}
window.register = register;

//EVENT LISTENERS
const form = document.querySelector('.login-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});
