document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector(".timezone-area");
  if (!widget) return;

  const editButton = widget.querySelector("#editTimezoneBtn");
  const editor = widget.querySelector("#timezoneEditor");
  const cancelButton = widget.querySelector("#cancelTimezoneBtn");

  editButton.addEventListener("click", () => {
    editor.hidden = false;
  });

  cancelButton.addEventListener("click", () => {
    editor.hidden = true;
  });
});