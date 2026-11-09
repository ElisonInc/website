"use strict";
const form = document.getElementById("inquiry-form");
if (form) {
  const status = document.getElementById("inquiry-status");
  const button = form.querySelector('button[type="submit"]');
  if (new URLSearchParams(window.location.search).get("service") === "video") {
    const serviceSelect = form.querySelector("#client-service");
    if (serviceSelect) serviceSelect.value = "Commercial or product video production — custom";
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.querySelector('[name="_honey"]').value.trim()) return;
    button.disabled = true;
    status.textContent = "Sending your inquiry…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === "false") throw new Error("Submission rejected");
      form.reset();
      status.textContent = "Your inquiry was submitted. We will review it and get back to you if there is a fit.";
    } catch (error) {
      status.textContent = "We couldn't confirm delivery. Please email info@elisoninc.com directly instead.";
    } finally {
      button.disabled = false;
    }
  });
}
