const contactUsForm = document.getElementById("contact-form");

contactUsForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementsByName("email-field")[0].value;
  console.log(email);
  const subject = document.getElementsByName("subject-field")[0].value;
  const message = document.getElementsByName("message-field")[0].value;
  const checkbox = document.getElementsByName("tos-checkbox")[0];

  if (!email || !subject || !message) {
    alert("Please fill all the fields");
    return;
  } else if (checkbox.checked === false) {
    alert("You should agree with our Terms of Service first");
  } else {
    alert(
      "Thanks, we have received your message and will answer your question as soon as possible"
    );
  }
});
