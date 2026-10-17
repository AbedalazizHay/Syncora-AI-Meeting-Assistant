document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector(".timezone-area");
  if (!widget) return;

  const editButton = widget.querySelector("#editTimezoneBtn");
  const editor = widget.querySelector("#timezoneEditor");
  const cancelButton = widget.querySelector("#cancelTimezoneBtn");
  const overlay = document.querySelector("#timezoneModalOverlay");

  function openEditor() {
    editor.hidden = false;
    overlay.hidden = false;
    editButton.setAttribute("aria-expanded", "true");
  }

  function closeEditor() {
    editor.hidden = true;
    overlay.hidden = true;
    editButton.setAttribute("aria-expanded", "false");
    editButton.focus();
  }

  editButton.addEventListener("click", openEditor);
  cancelButton.addEventListener("click", closeEditor);
  overlay.addEventListener("click", closeEditor);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !editor.hidden) {
      closeEditor();
    }
  });
});