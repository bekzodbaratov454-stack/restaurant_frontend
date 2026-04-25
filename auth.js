const BASE = "http://localhost:4000/api";

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".form").forEach(f => f.classList.add("hidden"));
  event.target.classList.add("active");
  document.getElementById(tab + "-form").classList.remove("hidden");
  document.getElementById("auth-msg").textContent = "";
}

function showForgot() {
  document.querySelectorAll(".form").forEach(f => f.classList.add("hidden"));
  document.getElementById("forgot-form").classList.remove("hidden");
}

function showLogin() {
  document.querySelectorAll(".form").forEach(f => f.classList.add("hidden"));
  document.getElementById("login-form").classList.remove("hidden");
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("auth-msg");
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("token", data.data.accessToken);
    showDashboard();
  } catch (err) {
    msg.textContent = err.message;
  }
});

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("auth-msg");
  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("reg-name").value,
        email: document.getElementById("reg-email").value,
        password: document.getElementById("reg-password").value,
        role: "admin",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("token", data.data.accessToken);
    showDashboard();
  } catch (err) {
    msg.textContent = err.message;
  }
});

document.getElementById("forgot-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("auth-msg");
  try {
    const res = await fetch(`${BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: document.getElementById("forgot-email").value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    msg.className = "msg success";
    msg.textContent = "Email yuborildi!";
  } catch (err) {
    msg.className = "msg";
    msg.textContent = err.message;
  }
});
