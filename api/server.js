const express = require('express');
const app = express();
const fs = require('fs');
const cors = require("cors");
app.use(cors());


// ENABLE JSON BODY PARSING
app.use(express.json());

// READ JSON FILE ONE TIME WHEN SERVER STARTS
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

// -------------------------------
// FUNCTION #1
// GET /products
// -------------------------------
app.get('/products', (req, res) => {
  res.json(products); // Send JSON directly to client
});

// Gets a specific product based off id
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// Fake login that returns a token
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123") {
    return res.json({ token: "fake-jwt-token-12345" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer fake-jwt-token-12345") {
    return next();
  }
  return res.status(403).json({ error: "Unauthorized" });
}

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ secret: "Welcome admin!" });
});




// Start server
app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
