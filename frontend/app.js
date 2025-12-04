let token = null;
let loginToken = null;

document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    token = data.token;
    document.getElementById("login-status").textContent = "Logged in!";
  } else {
    document.getElementById("login-status").textContent = data.error;
  }
});

document.getElementById("load-products-btn").addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach(p => {
    const item = document.createElement("li");
    item.textContent = `${p.id}: ${p.name} - $${p.price}`;
    list.appendChild(item);
  });
});

document.getElementById("secret-btn").addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/protected", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();
  document.getElementById("secret-message").textContent = data.secret || data.error;
});

async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    loginToken = data.token;
    document.getElementById("login-status").innerText = "Login successful ✔️";
  } else {
    document.getElementById("login-status").innerText = "Login failed ❌";
  }
}

async function loadProducts() {
  const res = await fetch("http://localhost:3000/products", {
    headers: { "Authorization": token ? `Bearer ${token}` : "" }
  });

  const products = await res.json();

  const list = document.getElementById("products");
  list.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `<strong>${p.name}</strong><br>Price: $${p.price}`;
    list.appendChild(div);
  });
}
