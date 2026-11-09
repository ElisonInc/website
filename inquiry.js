"use strict";
const form = document.getElementById("inquiry-form");
if (form) form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = ["Name: " + data.get("name"), "Email: " + data.get("email"), "Company / project: " + data.get("company"), "Service: " + data.get("service"), "Budget: " + data.get("budget"), "", "Goal, challenge and timeline:", data.get("message")].join("\n");
  const link = "mailto:info@elisoninc.com?subject=" + encodeURIComponent("Elison Inc. — " + data.get("service")) + "&body=" + encodeURIComponent(text);
  document.getElementById("inquiry-status").textContent = "Your email app will open with your inquiry. Review it and send it there. If it does not open, use the direct email link. Nothing has been sent by this website.";
  window.location.href = link;
});
