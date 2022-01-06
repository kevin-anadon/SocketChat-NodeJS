const button = document.getElementById('google_signout');
const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
              ? 'http://localhost:8080/api/auth/'
              : 'http://restserver-curso-node-kevin.herokuapp.com/api/auth/';

// Login Normal
miFormulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {};

  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(resp => resp.json())
  .then(({ msg, token }) => {
    if (msg) {
      return console.error(msg);
    }
    localStorage.setItem('token', token);
    window.location = 'chat.html';
  })
  .catch(err => {
    console.log(err);
  });
});

// Google SignIn
function handleCredentialResponse (response) {
  const body = { id_token: response.credential };
  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => resp.json())
  .then(({ usuario, token }) => {
    localStorage.setItem('token',token);
    localStorage.setItem('email',usuario.correo);
    window.location = 'chat.html';
  })
  .catch(err => {
    console.warn(err);
  });
}
