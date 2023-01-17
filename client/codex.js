import bot from './assets/bot.svg'
import user from './assets/user.svg'

let auth = localStorage.getItem('auth');
let jwt = localStorage.getItem('jwt');

if(Number(auth) !== 1){
  //location.href = 'index.html'
  document.querySelector('body').style.display = 'none';
  window.location.replace('./');
}
else{
  document.querySelector('body').style.display = 'block';
}

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index ++;
    }
    else{
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp} - ${hexadecimalString}`
}

function chatStripe(isAi, value, uniqueId) {
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server

  const response = await fetch('https://codexai-s8l9.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData)
  }
  else{
    const error = await response.text();

    messageDiv.innerHTML = 'Something went wrong';
    alert(error)
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})

let logoutBtn = document.querySelector('.logout-btn')
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('auth');
  window.location.replace('./')
})

fetch('https://login-rest-api.onrender.com/getuser', {
  method: 'GET',
  mode: 'cors',
  headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${jwt}`
  }
})
.then(response => {
  return response.json();
})
.then(data => {
  console.log(data);
  document.querySelector('.users-name').textContent = data.user.name;
})