async function loadCategories() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const list = document.getElementById("cat-list");
  const stats = document.getElementById("cat-stats");

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Jami</div>
      <div class="stat-value">${data.data?.length || 0}</div>
    </div>
  `;

  if (!data.data?.length) {
    list.innerHTML = `<p class="empty">Hozircha kategoriyalar yo'q</p>`;
    return;
  }

  list.innerHTML = data.data.map(cat => `
    <div class="card">
      <div class="card-icon">🍽️</div>
      <div class="card-info">
        <strong>${cat.name}</strong>
        <span>${new Date(cat.createdAt).toLocaleDateString("uz-UZ")}</span>
      </div>
      <div class="card-actions">
        <button class="btn-delete" onclick="deleteCategory('${cat._id}')">O'chirish</button>
      </div>
    </div>
  `).join("");
}

async function createCategory() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("cat-name").value.trim();
  const msg = document.getElementById("cat-msg");

  if (!name) { msg.textContent = "Nom kiriting"; return; }

  try {
    const res = await fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    document.getElementById("cat-name").value = "";
    closeModal("cat-modal");
    loadCategories();
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function deleteCategory(id) {
  const token = localStorage.getItem("token");
  await fetch(`${BASE}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadCategories();
}
