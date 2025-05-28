const form = document.querySelector("form");

const userData = {
  password: null,
  winStreak: 0,
  pokedex: [],
};
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementsByName("email-field")[0].value;
  if (localStorage.getItem("users") === null) {
    localStorage.setItem("users", JSON.stringify([]));
    console.log(localStorage.users);
  } else {
    const users = JSON.parse(localStorage.getItem("users"));
    if (users.includes(email)) {
      alert("User already exists");
      return;
    } else {

      localStorage.setItem("users", users.push(email));
    }
  }
  const password = document.getElementsByName("password-field")[0].value;
  const confirmPassword =
    document.getElementsByName("confirm-pw-field")[0].value;
  if (password !== confirmPassword) {
    alert("Password don't match");
    return;
  }
  userData["password"] = password;
  localStorage.setItem(email, userData);

  console.log(localStorage);
  alert("Registration Complete, redirecting to login page");
  setTimeout(window.location.replace("http://127.0.0.1:5500/login.html"), 2000);
});
