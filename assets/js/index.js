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
  const loggedIn = sessionStorage.getItem("isLoggedIn");
  if (loggedIn) {
    console.log("in");
    const email = loggedIn;
    setLoginLinks(email);
  } else {
    setLogoutLinks();
  }
}
main();
