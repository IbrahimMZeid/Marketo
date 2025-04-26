const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const error = document.getElementById("error");
window.addEventListener("load", function () {
  if (document.cookie.search("login")!= -1) {
    location.href = "index.html";
  }
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
  if (username) {
    username.addEventListener("input", function () {
      if (!validateUsername(username.value)) {
        username.classList.add("is-invalid");
      } else {
        username.classList.remove("is-invalid");
      }
      confirmPassword.addEventListener("input", function () {
        if (password.value != confirmPassword.value) {
          confirmPassword.classList.add("is-invalid");
        } else {
          confirmPassword.classList.remove("is-invalid");
        }
      });
    });
  }
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
  if (!validateUsername(username.value)) {
    error.innerText =
      "\nUsername must be at least 3 characters long starts with a letter and contain only letters, numbers and spaces";
  } else if (!validateEmail(email.value)) {
    error.innerText = "\nEmail is not valid";
  } else if (!validatePassword(password.value)) {
    error.innerText =
      "\nPassword must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  } else if (password.value != confirmPassword.value) {
    error.innerText = "\nPasswords do not match";
  } else {
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
  if (!validateEmail(email.value)) {
    error.innerText = "\nEmail is not valid";
  } else if (!validatePassword(password.value)) {
    error.innerText =
      "\nPassword must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  } else {
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
