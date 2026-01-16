const API = "/api/blogs";

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function setVal(id, v) {
  document.getElementById(id).value = v ?? "";
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function escapeHtmlAttr(str = "") {
  return escapeHtml(str).replace(/`/g, "&#096;");
}

async function loadBlogs() {
  const status = document.getElementById("status");
  try {
    if (status) status.textContent = "Loading...";

    const res = await fetch(API, { cache: "no-store" });
    if (!res.ok) {
      const t = await res.text();
      alert("Load failed: " + t);
      if (status) status.textContent = "Load failed";
      return;
    }

    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(b => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <div><b>${escapeHtml(b.title)}</b></div>
        <div>${escapeHtml(b.body)}</div>
        <div class="muted">
          id: ${b._id}<br/>
          author: ${escapeHtml(b.author)}<br/>
          createdAt: ${b.createdAt}<br/>
          updatedAt: ${b.updatedAt}
        </div>
        <div class="btns">
          <button onclick="fillForm('${b._id}','${escapeHtmlAttr(b.title)}','${escapeHtmlAttr(b.body)}','${escapeHtmlAttr(b.author)}')">Fill</button>
        </div>
      `;
      list.appendChild(div);
    });

    const now = new Date().toLocaleTimeString();
    if (status) status.textContent = `Loaded ${data.length} blog(s) at ${now}`;
  } catch (e) {
    alert("JS / Network error: " + e.message);
    if (status) status.textContent = "Error";
  }
}

function fillForm(id, title, body, author) {
  setVal("blogId", id);
  setVal("title", title);
  setVal("body", body);
  setVal("author", author);
}

async function createBlog() {
  const payload = {
    title: getVal("title"),
    body: getVal("body"),
    author: getVal("author") || undefined
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const t = await res.text();
    return alert(t);
  }

  setVal("title", "");
  setVal("body", "");
  setVal("author", "");
  loadBlogs();
}

async function updateBlog() {
  const id = getVal("blogId");
  if (!id) return alert("Provide Blog ID");

  const payload = {
    title: getVal("title") || undefined,
    body: getVal("body") || undefined,
    author: getVal("author") || undefined
  };

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const t = await res.text();
    return alert(t);
  }

  loadBlogs();
}

async function deleteBlog() {
  const id = getVal("blogId");
  if (!id) return alert("Provide Blog ID");

  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const t = await res.text();
    return alert(t);
  }

  setVal("blogId", "");
  loadBlogs();
}

loadBlogs();
