document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector(".timezone-area");
  if (!widget) return;
  const results = document.getElementById("timezoneResults");
  const originalTimezoneList = results.innerHTML;
  const editButton = widget.querySelector("#editTimezoneBtn");
  const editor = widget.querySelector("#timezoneEditor");
  const cancelButton = widget.querySelector("#cancelTimezoneBtn");
  const overlay = document.querySelector("#timezoneModalOverlay");
  
  function openEditor() {
    results.innerHTML = originalTimezoneList;
    document.getElementById("timezoneSearch").value = "";
    editor.hidden = false;
    overlay.hidden = false;
    editButton.setAttribute("aria-expanded", "true");
  }

 window.closeEditor = function () {
  editor.hidden = true;
  overlay.hidden = true;
  editButton.setAttribute("aria-expanded", "false");
  editButton.focus();
};

  editButton.addEventListener("click", openEditor);
  cancelButton.addEventListener("click", window.closeEditor);
  overlay.addEventListener("click", window.closeEditor);
 

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !editor.hidden) {
      window.closeEditor();
    }
  });
});

function makeRequest(){
  document.querySelector(".save-btn").removeAttribute("disabled")
}


const searchForm = document.querySelector("#timezoneSearchForm");
console.log("form found: "+searchForm);
searchForm.addEventListener("submit",async(event)=>{
  event.preventDefault();
  console.log("form submission intercepted")
const area=document.getElementById("timezoneSearch").value;
const errorMessage= document.getElementById("timezoneError");
errorMessage.textContent = "";
errorMessage.setAttribute("hidden", "");
  try{
  const response = await fetch("/findTimezone",{
    method:"POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    body: new URLSearchParams({ area })
  });
  const data= await response.json();
  console.log("Received from Express:", data);
  if(!response.ok){
    console.log(data.error);
    errorMessage.textContent=data.error;
    errorMessage.removeAttribute("hidden")
    return;
  }
  
const results = document.getElementById("timezoneResults");

// Remove the old timezone options
results.replaceChildren();

data.timezones.forEach((zone) => {
  const label = document.createElement("label");
  label.className = "timezone-option";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "timezone";
  radio.value = zone;
  radio.classList.add("timezone-radio")
  radio.onchange = makeRequest;

  const span = document.createElement("span");
  span.textContent = zone;

  label.append(radio, span);
  results.appendChild(label);
  });
}catch(error){
  console.error(error);
}

});

const saveTimezone = document.getElementById("saveNewTimezone");
console.log("form found: "+saveTimezone);
saveTimezone.addEventListener("submit",async(event)=>{
  event.preventDefault();
  console.log("form submission intercepted");
  const timezone = document.querySelector(".timezone-radio:checked").value;
  
  if (!timezone) {
  console.log("Please select a timezone");
  return;  
}

  
  try{
  const response = await fetch("/saveTimezone",{
    method:"POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    body: new URLSearchParams({timezone})
  });
  const data= await response.json();
  console.log(data);
  console.log("Received from Express:",data);
  if(!response.ok){
    console.log(data.error);
    return;
  }
  window.setTimezone(data.time,data.country,data.timezone);
  window.closeEditor();
console.log(data)
  }catch(error){
  console.error(error);
}

});