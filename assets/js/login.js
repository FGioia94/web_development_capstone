const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
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
