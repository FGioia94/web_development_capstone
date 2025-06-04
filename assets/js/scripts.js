const logo = document.getElementById("pokemon-logo");
const header = document.getElementsByTagName("header")[0];
const body = document.getElementsByTagName("body")[0];
let logoState = 0;
logo.onclick = () => {
  if (logoState === 0) {
    logoState = 1;
    console.log(header);
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

function setLoginLinks(email) {
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
  console.log("loggedout");
  sessionStorage.removeItem("isLoggedIn");
  console.log(sessionStorage.getItem("isLoggedIn"));

  window.location.href = `././index.html`;
}

function setLogoutLinks() {
  console.log("out");
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
  console.log("AAA", loggedIn)
  if (loggedIn) {
    const email = loggedIn;
    setLoginLinks(email);
  } else {
    setLogoutLinks();
  }
}
main();
