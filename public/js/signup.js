
const userRole = document.getElementById("userRole");
const inviteCodeContainer = document.getElementById("inviteCodeContainer");
const inviteCode = document.getElementById("inviteCode");
   userRole.addEventListener("change", function () {
const isEmployee = this.value === "user"; 
    // Show invitation field only for employees 
    inviteCodeContainer.classList.toggle("d-none", !isEmployee); 
    // Require the code only for employees 
    inviteCode.required = isEmployee;
    inviteCode.disabled = !isEmployee;
     // Clear the code when switching to leader
     if (!isEmployee) { 
        inviteCode.value = "";
     }
     });


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

