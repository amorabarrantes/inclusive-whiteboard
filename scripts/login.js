async function login() {
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;

  if (!email || !password) alert('Necesita ingresar las credenciales');

  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  const response = await fetch('../phps/login.php', {
    method: 'POST',
    body: formData,
  });
  const res = await response.json();

  console.log(res);
}

//EVENT LISTENERS
const form = document.querySelector('.login-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

async function register() {
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;

  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  console.log(formData);
  const response = await fetch('../phps/register.php', {
    method: 'POST',
    body: formData,
  });
  const res = await response.json();
  console.log(res);
}
