let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
window.addEventListener("load", function () {
  if (document.cookie.search("login") != -1) {
    location.href = "index.html";
  }
  if (location.href.search("register.html") != -1) register();
  addFieldsListener();
});
function addUserListener() {
  username.addEventListener("input", function () {
    if (!validateUsername(username.value)) {
      username.classList.add("is-invalid");
    } else {
      username.classList.remove("is-invalid");
    }
  });
}
function addFieldsListener() {
  email.addEventListener("input", function () {
    if (!validateEmail(email.value)) {
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }
  });
  password.addEventListener("input", function () {
    if (!validatePassword(password.value)) {
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }
  });
}

function validateEmail(email) {
  const re = /^\D[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}
function validatePassword(password) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(String(password));
}

function validateUsername(username) {
  const re = /^\w[a-zA-Z0-9 ]{2,}$/;
  return re.test(String(username));
}

async function register() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  // console.log(users);
  username.addEventListener("input", function () {
    if (!validateUsername(username.value)) {
      username.classList.add("is-invalid");
    } else {
      username.classList.remove("is-invalid");
    }
  });
  if (
    validateUsername(username.value) &&
    validateEmail(email.value) &&
    validatePassword(password.value)
  ) {
    let foundUser = users.find((user) => user.email == email.value.trim());
    if (foundUser) {
      alert("Email already exists");
    } else {
      users.push({
        name: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      });
      localStorage.setItem("users", JSON.stringify(users));
      location.href = "login.html";
    }
  }
}

async function login() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let userFound;
  if (validateEmail(email.value) && validatePassword(password.value)) {
    userFound = users.find(
      (user) =>
        user.email == email.value.trim() &&
        user.password == password.value.trim()
    );
    if (!userFound) {
      alert("Email or Password is not correct");
    } else {
      let expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 30);
      document.cookie = `name=${userFound.name}; expires=${expireDate};`;
      document.cookie = `email=${userFound.email}; expires=${expireDate};`;
      document.cookie = `login=true; expires=${expireDate};`;
      location.href = "index.html";
    }
  }
}
