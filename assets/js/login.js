/* A script that handles the dynamic functionalities of the login page
Author: Francesco Gioia
Last Modified: 06/06/2025*/

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  /*
  Handles user login via a form submission.
  Validates email and password fields, checks if the user exists in local storage, 
  and verifies the password. If successful, stores login state in session storage 
  and redirects the user to their dashboard.

  */
  event.preventDefault();
  const email = document.getElementsByName("email-field")[0].value;
  const password = document.getElementsByName("password-field")[0].value;
  if (!email || !password) {
    alert("Please fill all the fields");
    return;
  }
  if (localStorage.getItem(email) === null) {
    alert("User doesn't exist, please register first");
    return;
  }
  if (localStorage.getItem(email) !== password) {
    alert("Wrong Password");
  } else {
    console.log(email);
    sessionStorage.setItem("isLoggedIn", email);

    alert("Logged in, redirecting to your dashboard");

    window.location.href = `/dashboard.html?user=${email}`;
  }
});
