const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const mime = require('mime');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const nunjucks = require('nunjucks');

const stripe = require('stripe')('sk_test_51MyZGYLm2HjfbIuBd1bZFwKuM9exAUBnOxXIj1GF9hK93JZWFlbAQ64fMV8inkuETdf8wuEFNw2Z46n1fEryBfGA00yJRqTilN');

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

const dbConfig = {
  host: 'mysql-ismail.alwaysdata.net',
  user: 'ismail_prototype',
  password: 'Prototype13?',
  database: 'ismail_prototype_db'
};

app.use(session({
  secret: 'MDP',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 heures
}));

nunjucks.configure([
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public', 'views')
], {
  autoescape: true,
  express: app,
});

app.use(express.static(path.join(__dirname, 'public/views'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Type', mime.getType(filePath));
  }
}));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.get('/productDetails', (req, res) => {
  res.render('productDetails.html');
});

app.get('/checkout', (req, res) => {
  res.render('checkout.html');
});

app.get('/success', (req, res) => {
  res.render('successPayment.html');
});

app.get('/cancel', (req, res) => {
  res.render('cancelPayment.html');
});

app.get('/payment', (req, res) => {
  res.render('payment.html');
});


app.get('/api/products', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const valeurMin = req.query.min;
    const valeurMax = req.query.max;
    const connection = await mysql.createConnection(dbConfig);
    let query = 'SELECT id, name, price FROM products';
    if (searchQuery) {
      query += ' WHERE name LIKE ?';
      query += ' AND price >= ' + valeurMin + ' AND price <= ' + valeurMax;
    }
    const [rows] = await connection.query(query, [`%${searchQuery}%`]);
    res.json(rows);
    connection.end();
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur lors de la récupération des produits');
  }
});


app.get('/api/products/:productId', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT id, name, price, description, image_url FROM products WHERE id = ?', [req.params.productId]);
    res.json(rows[0]);
    connection.end();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du produit:', error);
    res.status(500).send('Erreur lors de la récupération des détails du produit');
  }
});


// Route pour se connecter
app.post('/api/login', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    if (rows.length === 0) {
      res.status(401).send('Email ou mot de passe incorrect');
    } else {
      const match = await bcrypt.compare(req.body.password, rows[0].password);
      if (match) {
        req.session.user = {
          id: rows[0].id,
          email: rows[0].email,
          role: rows[0].role
        };
        res.status(200).send('Connexion réussie');
      } else {
        res.status(401).send('Email ou mot de passe incorrect');
      }
    }
    connection.end();
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).send('Erreur lors de la connexion');
  }
});

// Route pour s'inscrire
app.post('/api/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [req.body.email, hashedPassword]);
    connection.end();
    res.status(201).send('Inscription réussie');
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

// Route pour vérifier si un utilisateur est connecté
app.get('/api/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Route pour la déconnexion
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Déconnexion réussie');
});

// Route pour passer une commande
app.post('/api/checkout', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Veuillez vous connecter pour passer une commande.');
  }
});

app.get('/ajouter-un-produit', (req, res) => {
  res.render('addProduct.html');
});

app.post('/api/add-product', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const { name, price, description, image_url } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)', [name, price, description, image_url]);
    connection.end();
    res.status(201).send('Produit ajouté avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    res.status(500).send('Erreur lors de l\'ajout du produit');
  }
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { lineItems } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4000/success',
      cancel_url: 'http://localhost:4000/cancel'
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API en écoute sur http://localhost:${port}`);
});
