const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const mime = require('mime');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const nunjucks = require('nunjucks');

const paypalClientId = 'ATcDyurH7u3DCSJiE2EaQ0we3Q-D1El4D2X4ClsL3IGijCp9nJ-UdJ4hV4eLh-DqWk9osSzut-6lrWF3';
const paypalClientSecret = 'EN4C3bqqIPUPbYdUC0kHwR4LGJfZbqYFjwjA1t_tVOsxRDWFTZPBHIShzZtjN8ob8vGtiFhX4aA-Rgum';

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const paypalEnvironment = new checkoutNodeJssdk.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(paypalEnvironment);


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


app.get('/api/products', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const connection = await mysql.createConnection(dbConfig);
    let query = 'SELECT id, name, price FROM products';
    if (searchQuery) {
      query += ' WHERE name LIKE ?';
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


function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    res.redirect('/login');
  }
}


// Route pour se connecter
app.post('/api/login', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    console.log('User data from database:', rows[0]);
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

  // Enregistrez la commande dans la base de données
  // ...

  res.json({ orderID: order.result.id });
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

app.post("/api/create-order", async (req, res) => {
  const { items } = req.body;

  // Créez l'objet de commande ici
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        description: "Achat sur votre site",
        amount: {
          currency_code: "EUR",
          value: "0.00", // Remplacez cette valeur par le montant total de la commande
        },
        items: items, // Ajoutez les articles de la commande
      },
    ],
  };

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.preferredLocale("fr-FR");
  request.requestBody(order);

  try {
    const response = await paypalClient.execute(request);
    res.json({ orderID: response.result.id });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).send("Erreur lors de la création de la commande");
  }
});

app.post("/api/checkout/:orderID", async (req, res) => {
  const request = new checkoutNodeJssdk.orders.OrdersGetRequest(req.params.orderID);

  try {
    const response = await paypalClient.execute(request);
    const order = response.result;

    // Validez et enregistrez la commande ici
    if (order.status === "COMPLETED") {
      // Enregistrez les détails de la commande dans votre base de données ou effectuez d'autres actions en fonction de votre application
      console.log("Commande validée et enregistrée :", order.id);
    } else {
      console.error("La commande n'a pas été validée :", order.id);
      res.status(500).send("La commande n'a pas été validée");
      return;
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    res.status(500).send("Erreur lors de la récupération de la commande");
  }
});




app.listen(port, () => {
  console.log(`API en écoute sur http://localhost:${port}`);
});

