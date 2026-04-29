async function loadProducts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const list = document.getElementById("prod-list");
  const stats = document.getElementById("prod-stats");

  const total = data.data?.length || 0;
  const avgPrice = total ? Math.round(data.data.reduce((s, p) => s + p.price, 0) / total) : 0;

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Jami</div>
      <div class="stat-value">${total}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">O'rtacha narx</div>
      <div class="stat-value">${avgPrice.toLocaleString()}</div>
    </div>
  `;

  if (!total) {
    list.innerHTML = `<p class="empty">Hozircha mahsulotlar yo'q</p>`;
    return;
  }

  list.innerHTML = data.data.map(p => `
    <div class="card">
      <div class="card-icon">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" style="width:56px;height:56px;object-fit:cover;border-radius:10px;display:block;">`
          : "🍗"}
      </div>
      <div class="card-info">
        <strong>${p.name}</strong>
        <span><span class="cat-badge">${p.category_id?.name || "—"}</span></span>
      </div>
      <div class="card-actions">
        <span class="price-tag">${p.price.toLocaleString()} UZS</span>
        <button class="btn-delete" onclick="deleteProduct('${p._id}')">O'chirish</button>
      </div>
    </div>
  `).join("");
}

async function loadCategoryOptions() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const select = document.getElementById("prod-category");
  select.innerHTML = `<option value="">Kategoriya tanlang</option>` +
    data.data.map(c => `<option value="${c._id}">${c.name}</option>`).join("");
}

async function createProduct() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("prod-name").value.trim();
  const price = document.getElementById("prod-price").value;
  const category_id = document.getElementById("prod-category").value;
  const msg = document.getElementById("prod-msg");

  if (!name || !price || !category_id) {
    msg.textContent = "Barcha maydonlarni to'ldiring";
    return;
  }

  try {
    const res = await fetch(`${BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, price: Number(price), category_id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    document.getElementById("prod-name").value = "";
    document.getElementById("prod-price").value = "";
    closeModal("prod-modal");
    loadProducts();
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function deleteProduct(id) {
  const token = localStorage.getItem("token");
  await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadProducts();
}
