 function checkPassword(event) {
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;
        const passwordError = document.getElementById("passwordError");
        const confirmInput = document.getElementById("confirmPassword");
        if (password !== confirmPassword) {
          event.preventDefault();
          passwordError.textContent = "Passwords do not match!";
          confirmInput.classList.add("is-invalid");
          return false;
        }
        passwordError.textContent = "";
        confirmInput.classList.remove("is-invalid");
        return true;
      }
      document
        .getElementById("confirmPassword")
        .addEventListener("input", ()=> {
          document.getElementById("passwordError").textContent = "";
          this.classList.remove("is-invalid");
        });