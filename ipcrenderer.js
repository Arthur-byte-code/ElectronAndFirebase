const {  ipcRenderer } = require('electron');

if (document.getElementById('registerBtn')){
document.getElementById('registerBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Enviando dados de registro:', email, password); 
    ipcRenderer.send('register', email, password);
  });
}
 else{
  document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Enviando dados de login:', email, password); 
    ipcRenderer.send('login', email, password);
  });
 }