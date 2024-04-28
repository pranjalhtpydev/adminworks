import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr8DFXT9jK53PSmbhqf2CbsQdyHTp9GXc",
  authDomain: "adminwork-af748.firebaseapp.com",
  projectId: "adminwork-af748",
  storageBucket: "adminwork-af748.appspot.com",
  messagingSenderId: "771867273912",
  appId: "1:771867273912:web:1febfdcc26648c1fff224d",
  measurementId: "G-C8QC2D0BB0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let passwords = [];

// Email Link Authentication
document.getElementById('emailLinkAuth').addEventListener('click', sendEmailLink);

function sendEmailLink() {
  const email = prompt('Please enter your email address:');
  if (email) {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        alert('Email link sent successfully on your email ! Check your inbox!');
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred. Please try again later.');
      });
  } else {
    alert('Please enter a valid email address.');
  }
}

if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      window.localStorage.removeItem('emailForSignIn');
      showPasswordForm();
    })
    .catch((error) => {
      console.error(error);
      alert('An error occurred. Please try again later.');
    });
}

// Google Authentication
const provider = new GoogleAuthProvider();

document.getElementById('googleAuth').addEventListener('click', signInWithGoogle);

function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
      showPasswordForm();
    })
    .catch((error) => {
      console.error("Error signing in:", error);
      alert("An error occurred during Google Sign-In. Please try again later.");
    });
}

// Function to show password form and hide login form
function showPasswordForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('passwordForm').style.display = 'block';
  renderPasswordList();
}

// Save password
document.getElementById('savePasswordBtn').addEventListener('click', savePassword);

function savePassword() {
  const website = document.getElementById('websiteInput').value;
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;

  if (website && username && password) {
    const passwordItem = {
      website,
      username,
      password,
      isVisible: false
    };

    passwords.push(passwordItem);

    document.getElementById('websiteInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';

    renderPasswordList();
  } else {
    alert('Please fill in all fields.');
  }
}

// Render password list
function renderPasswordList() {
  const passwordList = document.getElementById('passwordList');
  passwordList.innerHTML = '';

  passwords.forEach((passwordItem, index) => {
    const li = document.createElement('li');
    const passwordMask = document.createElement('span');
    passwordMask.classList.add('password-mask');
    passwordMask.textContent = passwordItem.isVisible ? passwordItem.password : '••••••••';

    const actions = document.createElement('div');
    actions.classList.add('password-actions');

    const viewButton = document.createElement('button');
    viewButton.innerHTML = '<i class="fas fa-eye"></i>';
    viewButton.addEventListener('click', () => togglePasswordVisibility(index));

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', () => editPassword(index));

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => deletePassword(index));

    actions.appendChild(viewButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.textContent = `Website/App: ${passwordItem.website}, Username: ${passwordItem.username}, Password: `;
    li.appendChild(passwordMask);
    li.appendChild(actions);

    passwordList.appendChild(li);
  });
}

// Toggle password visibility
function togglePasswordVisibility(index) {
  passwords[index].isVisible = !passwords[index].isVisible;
  renderPasswordList();
}

// Edit password
function editPassword(index) {
  const passwordItem = passwords[index];
  const website = prompt('Enter the website/app name:', passwordItem.website);
  const username = prompt('Enter the username:', passwordItem.username);
  const password = prompt('Enter the new password:', passwordItem.password);

  if (website && username && password) {
    passwords[index] = {
//       website,
//       username,
      password,
      isVisible: passwordItem.isVisible
    };

    renderPasswordList();
  }
}

// Delete password
function deletePassword(index) {
  if (confirm('Are you sure you want to delete this password?')) {
    passwords.splice(index, 1);
    renderPasswordList();
  }
}

// Export passwords as CSV
document.getElementById('exportBtn').addEventListener('click', exportPasswordsToCSV);

function exportPasswordsToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Website/App,Username,Password\n";

  passwords.forEach(passwordItem => {
    const row = `${passwordItem.website},${passwordItem.username},${passwordItem.password}\n`;
    csvContent += row;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "passwords.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
    } 
