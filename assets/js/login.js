const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementsByName("email-field")[0].value;
  const password = document.getElementsByName("password-field")[0].value;
  if (localStorage.getItem(email) === null) {
    alert("User doesn't exist, please register first");
    return;
  }
  if (localStorage.getItem(email).password !== password) {
    alert("Wrong Password");
  } else {
    sessionStorage.setItem("isLoggedIn", email);
  }
});
