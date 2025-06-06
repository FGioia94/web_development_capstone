/* A General script that contains the scripts used for all the pages
Author: Francesco Gioia
Last Modified: 06/06/2025*/

const logo = document.getElementById("pokemon-logo");
const header = document.getElementsByTagName("header")[0];
const body = document.getElementsByTagName("body")[0];
let logoState = 0; // Initial visibility state of the header

logo.onclick = () => {
  /*
  This makes the header bar disappear and appear when the logo is clicked
  */
  if (logoState === 0) {
    logoState = 1;
    header.style.visibility = "hidden";
    logo.style.padding = "1.5em";
    logo.style.position = "fixed";
    logo.style.zIndex = "999";
    body.insertBefore(logo, body.children[0]);
  } else if (logoState === 1) {
    logoState = 0;
    header.style.visibility = "visible";
    logo.style.padding = "0em";
    logo.style.position = "static";
    header.insertBefore(logo, header.children[0]);
  }
};

const form = document.getElementById("footer-contact");
if (form) {
  /*
  If there is a footer contact form, 
  add form validations and raise an alert when the form is submitted
  */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const emailField = document.getElementsByName("email")[0];
    const messageBox = document.getElementsByName("message")[0];
    const checkbox = document.getElementsByName("tos-checkbox")[0];

    if (emailField.value === "" || messageBox.value === "") {
      alert("You should fill all the form first");
    } else if (checkbox.checked === false) {
      alert("You should agree with our Terms of Service first");
    } else {
      alert(
        "Thanks, we have received your message and will answer your question as soon as possible"
      );
    }
  });
}

function setLoginLinks(email) {
  /*
  Function to update the navbar links based on the user's login state.
  It changes the "Login" button to a "Logout" button and updates the "Sign in" button 
  to display the user's email and link to their dashboard.

  @param email: A string representing the user's email.
  */

  const login = document.getElementById("login");
  const signin = document.getElementById("signin");
  login.textContent = "Logout";
  login.href = "#";
  login.onclick = function () {
    logout(email);
  };
  signin.textContent = email;
  signin.href = `/dashboard.html?user=${email}`;
}

function logout() {
  login.onclick = null;
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = `././index.html`;
}

function setLogoutLinks() {
  /*
  Function to reset the navbar links when the user logs out.
  It changes the "Sign in" button back to its default text and link,
  and updates the "Login" button accordingly.
  */

  const login = document.getElementById("login");
  const signin = document.getElementById("signin");
  signin.textContent = "Sign In";
  signin.href = "././register.html";
  login.textContent = "Login";
  login.href = "././login.html";
}

function main() {
  logo.click();
  const loggedIn = sessionStorage.getItem("isLoggedIn");
  if (loggedIn) {
    const email = loggedIn;
    setLoginLinks(email);
  } else {
    setLogoutLinks();
  }
}
main();
