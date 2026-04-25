async function loadFeedbacks() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/feedback`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const list = document.getElementById("feed-list");
  const stats = document.getElementById("feed-stats");

  const reviews = data.data?.filter(f => f.type === "review").length || 0;
  const complaints = data.data?.filter(f => f.type === "complaint").length || 0;

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Jami</div>
      <div class="stat-value">${data.data?.length || 0}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Sharhlar</div>
      <div class="stat-value">${reviews}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Shikoyatlar</div>
      <div class="stat-value">${complaints}</div>
    </div>
  `;

  if (!data.data?.length) {
    list.innerHTML = `<p class="empty">Hozircha feedbacklar yo'q</p>`;
    return;
  }

  list.innerHTML = data.data.map(f => `
    <div class="card">
      <div class="card-icon">${f.type === 'review' ? '⭐' : '⚠️'}</div>
      <div class="card-info">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span class="badge ${f.type === 'review' ? 'badge-review' : 'badge-complaint'}">${f.type}</span>
          <strong>${f.message}</strong>
        </div>
        <span>${f.device_info}</span>
      </div>
      <div class="card-actions">
        <button class="btn-delete" onclick="deleteFeedback('${f._id}')">O'chirish</button>
      </div>
    </div>
  `).join("");
}

async function deleteFeedback(id) {
  const token = localStorage.getItem("token");
  await fetch(`${BASE}/feedback/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadFeedbacks();
}
