const { app, BrowserWindow, ipcMain } = require('electron');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

require('dotenv').config();// environmental variables

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

ipcMain.on('register', (event, email, password) => {
  console.log('Tentativa de login recebida:', email, password); 
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log('Usuário registrado:', user);

      // Salvar no Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date()
        });
        console.log('Dados do usuário salvos no Firestore');
      } catch (error) {
        console.error('Erro ao salvar dados no Firestore:', error);
      }
    })
    .catch((error) => {
      console.error('Erro ao registrar:', error.message);
    });
});

ipcMain.on('login', (event, email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Usuário logado:', user);
    })
    .catch((error) => {
      console.error('Erro ao fazer login:', error.message);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
