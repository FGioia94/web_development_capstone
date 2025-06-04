const signInForm = document.getElementById("sign-in-form");

signInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementsByName("email-field")[0].value;
  const password = document.getElementsByName("password-field")[0].value;
  const confirmPassword =
    document.getElementsByName("confirm-pw-field")[0].value;

  if (!email || !password || !confirmPassword){
    alert("Please fill all the fields");
    return;
  }
  console.log(typeof localStorage.getItem(email));
  if (localStorage.getItem(email) !== null) {
    alert("User already exists");
    return;
  }

  
  
  if (password !== confirmPassword) {
    alert("Password don't match");
    return;
  }
  localStorage.setItem(email, password);

  console.log(localStorage);
  alert("Registration Complete, redirecting to login page");
  setTimeout(window.location.replace("http://127.0.0.1:5500/login.html"), 2000);
});
