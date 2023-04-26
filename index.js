const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const mime = require('mime');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const nunjucks = require('nunjucks');
const requestIp = require('request-ip');


//Base de données pour stocker les infos utilisateurs
const infosUtilisateurs = {
  host: 'postgresql-ismail.alwaysdata.net',
  user: 'ismail',
  password: 'Prototype13!',
  database: 'ismail_panier_abandonne',
};


//Base de données pour les métriques
const clickDbConfig = {
  host: 'postgresql-ismail.alwaysdata.net',
  user: 'ismail',
  password: 'Prototype13!',
  database: 'ismail_clicks',
};

const clickPgPool = new Pool(clickDbConfig);

const stripe = require('stripe')('sk_test_51MyZGYLm2HjfbIuBd1bZFwKuM9exAUBnOxXIj1GF9hK93JZWFlbAQ64fMV8inkuETdf8wuEFNw2Z46n1fEryBfGA00yJRqTilN');

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

const dbConfig = {
  host: 'postgresql-ismail.alwaysdata.net',
  user: 'ismail',
  password: 'Prototype13!',
  database: 'ismail_prototype'
};

const pgPool = new Pool(dbConfig);

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
const connection = await pgPool.connect();
let query = 'SELECT id, name, price FROM products';
let queryParams = [];

if (searchQuery) {
  query += ' WHERE name LIKE $1';
  queryParams.push(`%${searchQuery}%`);
  query += ' AND price >= $2 AND price <= $3';
  queryParams.push(valeurMin, valeurMax);
}

const { rows } = await connection.query(query, queryParams);
    res.json(rows);
    connection.release();
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur lors de la récupération des produits');
    }
    });


  app.get('/api/products/:productId', async (req, res) => {
     try {
     const client = await pgPool.connect();
  const { rows } = await client.query('SELECT id, name, price, description, image_url FROM products WHERE id = $1', [req.params.productId]);
     res.json(rows[0]);
      client.release();
      } catch (error) {
      console.error('Erreur lors de la récupération des détails du produit:', error);
      res.status(500).send('Erreur lors de la récupération des détails du produit');
      }
      });


// Route pour se connecter
app.post('/api/login', async (req, res) => {
  try {
  const client = await pgPool.connect();
  const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
  if (rows.length === 0) {
  res.status(401).send('Email ou mot de passe incorrect');
  } else {
  const match = await bcrypt.compare(req.body.password, rows[0].password);
  if (match) {
  const userIpAddress = req.connection.remoteAddress;
  req.session.user = {
  id: rows[0].id,
  email: rows[0].email,
  ip_address: userIpAddress // Ajoutez cette ligne
  };
  res.status(200).send('Connexion réussie');
  } else {
  res.status(401).send('Email ou mot de passe incorrect');
  }
  }
  client.release();
  } catch (error) {
  console.error('Erreur lors de la connexion:', error);
  res.status(500).send('Erreur lors de la connexion');
  }
  });

// Route pour s'inscrire
app.post('/api/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userIpAddress = requestIp.getClientIp(req);
    const client = await pgPool.connect();
    await client.query('INSERT INTO users (email, password, ip_address) VALUES ($1, $2, $3)', [req.body.email, hashedPassword, userIpAddress]);
    client.release();
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

app.post('/api/clicks', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.user ? req.session.user.id : null; // Utilisez l'ID de l'utilisateur s'il est connecté, sinon définissez-le sur null
    const userIpAddress = req.ip; // Ajoutez cette ligne pour obtenir l'adresse IP de l'utilisateur
    const client = await clickPgPool.connect();
    const result = await client.query('INSERT INTO suivi_clicks (user_id, product_id, click_timestamp, user_ip) VALUES ($1, $2, NOW(), $3)', [userId, productId, userIpAddress]);
    client.release();
    res.status(200).send('Click enregistré');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du clic:', error);
    res.status(500).send('Erreur lors de l\'enregistrement du clic');
  }
});

app.get('/api/clicks/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).send({ error: 'productId is required' });
    }

    const client = await clickPgPool.connect();
    const selectQuery = 'SELECT COUNT(*) as count FROM suivi_clicks WHERE product_id = $1';
    const { rows } = await client.query(selectQuery, [productId]);
    client.release();

    res.status(200).send({ productId, clicks: rows[0].count });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


app.post('/api/save-user-data', async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
      res.status(400).send('Nom, prénom et email sont requis');
      return;
    }

    const client = await pgPool.connect();
    await client.query('INSERT INTO users_data (nom, prenom, email) VALUES ($1, $2, $3)', [nom, prenom, email]);
    client.release();
    res.status(201).send('Données enregistrées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des données:', error);
    res.status(500).send('Erreur lors de l\'enregistrement des données');
  }
});


app.listen(port, () => {
  console.log(`API en écoute sur http://localhost:${port}`);
});
