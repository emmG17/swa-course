# TiendaNube — Case Study Starter Project
## Week 5 Assignment: Refactoring Plan

---

## Background

**TiendaNube** is a small online store selling Mexican artisanal products — alebrijes, handwoven textiles, Talavera ceramics, and embroidered goods from Oaxaca, Puebla, and Chiapas.

It was built by a solo junior developer who learned Express from YouTube tutorials. The app works — every endpoint returns the correct data, and the artisans are happy. But the developer is now afraid to add new features because every change seems to break something else.

Your job: plan how to refactor this into a well-structured, layered monolith.

---

## The Code: `server.js`

Below is the entire application. **It works.** All endpoints function correctly. The problem is structure, not behavior.

```javascript
// server.js — TiendaNube API
// "Everything in one file because it was easier that way" — the original developer

const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tiendanube',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const JWT_SECRET = 'super-secret-key-dont-tell-anyone'; // 🔴 Hardcoded secret

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'customer']
    );

    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    // Send welcome email
    try {
      await transporter.sendMail({
        from: '"TiendaNube" <hola@tiendanube.mx>',
        to: email,
        subject: '¡Bienvenido a TiendaNube!',
        html: `<h1>¡Hola ${name}!</h1><p>Gracias por unirte a TiendaNube. Explora nuestros productos artesanales.</p>`,
      });
    } catch (emailError) {
      console.log('Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// PRODUCTS ROUTES
// ==========================================

app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let query = 'SELECT * FROM products WHERE active = true';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    if (minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ products: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Products list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.name as artisan_name FROM products p JOIN users u ON p.artisan_id = u.id WHERE p.id = $1 AND p.active = true',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    // Auth check — copy-pasted 🔴
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (decoded.role !== 'artisan' && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Only artisans can create products' });
    }

    const { name, description, price, category, stock, origin } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    const validCategories = ['alebrijes', 'textiles', 'ceramica', 'bordados', 'joyeria', 'otros'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, origin, artisan_id, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
      [name, description || '', price, category, stock || 0, origin || '', decoded.id]
    );

    res.status(201).json({ product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ORDERS ROUTES
// ==========================================

app.post('/api/orders', async (req, res) => {
  try {
    // Auth check — copy-pasted AGAIN 🔴
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { items } = req.body; // [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    // Calculate total and check stock — business logic mixed with route 🔴
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const productResult = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND active = true',
        [item.productId]
      );

      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Discount logic — business rule buried in route handler 🔴
      let itemPrice = product.price * item.quantity;
      if (item.quantity >= 5) {
        itemPrice *= 0.95; // 5% discount for 5+ items
      }
      if (item.quantity >= 10) {
        itemPrice *= 0.9; // Additional 10% for 10+ items (stacks with above)
      }

      total += itemPrice;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemPrice,
      });
    }

    // Free shipping for orders over 1500 MXN — another business rule inline 🔴
    const shippingCost = total >= 1500 ? 0 : 150;
    total += shippingCost;

    // Create order in DB
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, items, total, shipping_cost, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [decoded.id, JSON.stringify(orderItems), total, shippingCost]
    );

    // Update stock for each product — data operation mixed in 🔴
    for (const item of items) {
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        item.productId,
      ]);
    }

    // Send order confirmation email — infrastructure mixed with everything 🔴
    const userResult = await pool.query('SELECT email, name FROM users WHERE id = $1', [
      decoded.id,
    ]);
    const user = userResult.rows[0];

    try {
      await transporter.sendMail({
        from: '"TiendaNube" <hola@tiendanube.mx>',
        to: user.email,
        subject: `Pedido #${orderResult.rows[0].id} confirmado`,
        html: `
          <h1>¡Gracias por tu compra, ${user.name}!</h1>
          <p>Tu pedido #${orderResult.rows[0].id} ha sido confirmado.</p>
          <p><strong>Total: $${total.toFixed(2)} MXN</strong></p>
          <p>${shippingCost === 0 ? '🎉 ¡Envío gratis!' : `Envío: $${shippingCost} MXN`}</p>
          <h3>Productos:</h3>
          <ul>
            ${orderItems.map((i) => `<li>${i.productName} x${i.quantity} — $${i.subtotal.toFixed(2)}</li>`).join('')}
          </ul>
        `,
      });
    } catch (emailError) {
      console.log('Failed to send order confirmation:', emailError.message);
    }

    res.status(201).json({
      order: orderResult.rows[0],
      items: orderItems,
      shipping: shippingCost === 0 ? 'FREE' : `$${shippingCost} MXN`,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    // Auth check — copy-pasted YET AGAIN 🔴
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    let result;
    if (decoded.role === 'admin') {
      result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    } else {
      result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [
        decoded.id,
      ]);
    }

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/orders/:id/cancel', async (req, res) => {
  try {
    // Auth check — copy-pasted ONE MORE TIME 🔴
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Authorization check — can only cancel your own orders (or admin)
    if (order.user_id !== decoded.id && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You can only cancel your own orders' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    // Cancel and restore stock — business logic + data access mixed 🔴
    await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [req.params.id]);

    const items = JSON.parse(order.items);
    for (const item of items) {
      await pool.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [
        item.quantity,
        item.productId,
      ]);
    }

    // Send cancellation email
    const userResult = await pool.query('SELECT email, name FROM users WHERE id = $1', [
      order.user_id,
    ]);

    try {
      await transporter.sendMail({
        from: '"TiendaNube" <hola@tiendanube.mx>',
        to: userResult.rows[0].email,
        subject: `Pedido #${order.id} cancelado`,
        html: `<h1>Pedido cancelado</h1><p>Tu pedido #${order.id} ha sido cancelado. El reembolso será procesado en 3-5 días hábiles.</p>`,
      });
    } catch (emailError) {
      console.log('Failed to send cancellation email:', emailError.message);
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TiendaNube API running on port ${PORT}`);
});
```

---

## Database Schema (For Reference)

```sql
-- schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer', -- customer, artisan, admin
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  stock INTEGER DEFAULT 0,
  origin VARCHAR(100) DEFAULT '',
  artisan_id INTEGER REFERENCES users(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Your Assignment

### What to Deliver:

#### 1. Architecture Diagram (25 points)
Create a diagram showing your proposed layered structure. Include:
- The layers you'd create
- Which modules/features go where
- Dependency direction (arrows pointing down)

**Format:** Mermaid code, hand-drawn photo, or any diagramming tool. A napkin sketch is fine as long as it's clear.

#### 2. Layer Description (15 points)
For each layer in your diagram, write 1-2 sentences explaining:
- What code lives in this layer
- What code does NOT belong here

#### 3. Refactoring Roadmap (35 points)
Describe the order in which you'd refactor `server.js`:
- What do you extract first? Why?
- What comes second?
- What are the risks of each step?
- How do you verify nothing breaks?

**This is the most important part.** I'm evaluating your thinking process, not perfection.

#### 4. One Refactored Module (25 points)
Pick ONE feature (products, orders, or users — I recommend starting with products) and actually refactor it into a layered structure. Show:
- The controller/route file
- The service file
- The repository file
- How they connect

You don't need to make it runnable — pseudocode or well-structured JavaScript is fine.

---

## Anti-Patterns to Spot (Hints)

Here are the problems hiding in `server.js`. Your refactoring should address all of them:

1. **JWT verification copy-pasted 4 times** → Should be a shared middleware
2. **Hardcoded JWT secret** → Should be in environment config
3. **Business logic in route handlers** → Discount calculation, free shipping rules, stock checks belong in services
4. **Raw SQL scattered everywhere** → Should be centralized in repositories
5. **Email sending inline** → Should be in an infrastructure module
6. **No error abstraction** → Custom error classes would clean up error handling
7. **Database pool created globally** → Should be injected

---

## Example: What a Refactored Products Module Might Look Like

This is just ONE possible approach. Yours may differ — that's fine as long as you can justify it.

```
src/
├── products/
│   ├── controller.js    ← HTTP handling only
│   ├── service.js       ← Business rules (validation, category checks)
│   └── repository.js    ← Database queries
├── shared/
│   ├── middleware/
│   │   └── auth.js      ← Single JWT verification middleware
│   ├── config/
│   │   └── database.js  ← Pool configuration
│   └── errors/
│       └── index.js     ← Custom error classes
```

---

*Case Study — Lesson 5 | Monoliths & Layered Architecture*
*TiendaNube v0.1.0 — "Beautifully functional, structurally terrifying"*
