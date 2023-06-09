/**
 * An Express application that provides an API for an e-commerce website.
 * @module app
 */
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
const http = require("http");
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');

/**
 * Database configuration for user information.
 * @type {Object}
 *   host: process.env.POSTGRES_INFOUTILISATEUR_HOST,
 *   user: process.env.POSTGRES_INFOUTILISATEUR_USER,
 *   password: process.env.POSTGRES_INFOUTILISATEUR_PASSWORD,
 *   database: process.env.POSTGRES_INFOUTILISATEUR_DATABASE,
 */
const infosUtilisateurs = {
  host: process.env.POSTGRES_INFOUTILISATEUR_HOST ,
  user: process.env.POSTGRES_INFOUTILISATEUR_USER,
  password: process.env.POSTGRES_INFOUTILISATEUR_PASSWORD ,
  database: process.env.POSTGRES_INFOUTILISATEUR_DATABASE,
};

const infosUtilisateursPool = new Pool(infosUtilisateurs);

/**
 * Database configuration for stats
 * @type {Object}
 */
const clickDbConfig = {
  host: process.env.POSTGRES_DBCLICK_HOST ,
  user: process.env.POSTGRES_DBCLICK_USER,
  password: process.env.POSTGRES_DBCLICK_PASSWORD ,
  database: process.env.POSTGRES_DBCLICK_DATABASE,
};

const clickPgPool = new Pool(clickDbConfig);

const stripe = require('stripe')('sk_test_51MyZGYLm2HjfbIuBd1bZFwKuM9exAUBnOxXIj1GF9hK93JZWFlbAQ64fMV8inkuETdf8wuEFNw2Z46n1fEryBfGA00yJRqTilN');


/**
 * Express application instance.
 * @type {Express}
 */
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

const port = process.env.ALWAYSDATA_HTTPD_PORT || 4000
const host = process.env.ALWAYSDATA_HTTPD_IP || 'localhost'


/**
 * Database configuration for products and users.
 * @type {Object}
 */
const dbConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password:  process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
};

const pgPool = new Pool(dbConfig);

app.use(session({
  secret: 'MDP',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 heures
}));


async function transferUserData(userId) {
  try {
    const client = await infosUtilisateursPool.connect();
    const result = await client.query('SELECT * FROM infos_utilisateur WHERE id = $1', [userId]);
    const userData = result.rows[0];

    if (userData) {
      await client.query('INSERT INTO users (nom, prenom, email, adresse, codepostal, ville, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7)', [userData.nom, userData.prenom, userData.email, userData.adresse, userData.code_postal, userData.ville, userData.telephone]);
      console.log('Données utilisateur transférées avec succès');
    } else {
      console.error('Utilisateur non trouvé');
    }

    client.release();
  } catch (error) {
    console.error('Erreur lors du transfert des données utilisateur:', error);
  }
}


/**
 * Configure nunjucks to render HTML files.
 */
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

app.get('/paymentInterface', (req, res) => {
  res.render('interfacePaiements.html');
});

app.get('/informations', (req, res) => {
  res.render('infosClients.html');
});



/**
 * API endpoint for fetching all products.
 * @route {GET} /api/products
 */
app.get('/api/products', async (req, res) => {
  try {
    const searchQuery = req.query.search;
const valeurMin = req.query.min;
const valeurMax = req.query.max;
const connection = await pgPool.connect();
let query = 'SELECT id, name, price FROM products';
let queryParams = [];

if (searchQuery) {
  query += ' WHERE name ILIKE $1';
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


 /**
 * API endpoint for fetching product details.
 * @route {GET} /api/products/:productId
 */   
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


/**
 * API endpoint for logging in.
 * @route {POST} /api/login
 */
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
  name: rows[0].name,
  first_name: rows[0].first_name,
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


/**
 * API endpoint for signing up.
 * @route {POST} /api/signup
 */
app.post('/api/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userIpAddress = requestIp.getClientIp(req);
    const client = await pgPool.connect();
    await client.query('INSERT INTO users (email, name, first_name, password, ip_address) VALUES ($1, $2, $3, $4, $5)', [req.body.email, req.body.name, req.body.first_name, hashedPassword, userIpAddress]);
    client.release();
    res.status(201).send('Inscription réussie');
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});


/**
 * API endpoint for checking if a user is logged in.
 * @route {GET} /api/isLoggedIn
 */app.get('/api/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});


/**
 * API endpoint for logging out.
 * @route {GET} /api/logout
 */
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Déconnexion réussie');
});

// Route pour passer une commande
app.post('/api/checkout', async (req, res) => {
  
});


/**
 * API endpoint for creating a checkout session.
 * @route {POST} /api/create-checkout-session
 */
app.post('/api/create-checkout-session', async (req, res) => {
  const { lineItems, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail, 
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['FR', 'US', 'CA']
      },
      mode: 'payment',
      success_url: `http://${host}:${port}/success`,
      cancel_url: `http://${host}:${port}/cancel`
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer panier abandonné
app.post('/api/save-abandoned-cart', async (req, res) => {
  const { userEmail, cartItems } = req.body;

  try {
    const client = await pgPool.connect();

    // requete pour inserer email et produits du panier abandonné sous format json
    // si l'email existe deja dans la bd, on met à jour le panier abandonné
    const query = `
    INSERT INTO abandoned_cart (user_email, cart_products)
    VALUES ($1, $2::json)
    ON CONFLICT (user_email)
    DO UPDATE SET cart_products = EXCLUDED.cart_products, created_at = NOW();
  `;  

    await client.query(query, [userEmail, JSON.stringify(cartItems)]);
    client.release();

    res.status(200).send('Panier abandonné sauvegardé');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la sauvegarde du panier abandonné');
  }
});



/**
 * API endpoint for recording a click.
 * @route {POST} /api/clicks
 */
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


/**
 * API endpoint for fetching click data for a specific product.
 * @route {GET} /api/clicks/:productId
 */
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


/**
 * API endpoint for saving user data.
 * @route {POST} /api/save-user-data
 */
app.post('/api/save-user-data', async (req, res) => {
  try {
    const { nom, prenom, email, adresse, codePostal, ville, telephone } = req.body;

    if (!nom || !prenom || !email || !adresse || !codePostal || !ville || !telephone) {
      res.status(400).send('Tous les champs sont requis');
      return;
    }

    const client = await infosUtilisateursPool.connect();
    await client.query('INSERT INTO infos_utilisateur (nom, prenom, email, adresse, codePostal, ville, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nom, prenom, email, adresse, codePostal, ville, telephone]);
    client.release();
    res.status(201).send('Données enregistrées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des données:', error);
    res.status(500).send('Erreur lors de l\'enregistrement des données');
  }
});


app.get('/admin',async(req,res)=>{
  res.render('adminPanel.html');
})

app.get('/admin/ajouterProduit',async (req,res)=>{
  res.render('./adminAjouterProduit.html');
})

app.post('/admin/form', async (req,res) =>{
  const nom = req.body.name;
  const prix = req.body.prix;
  const description = req.body.description;
  const source = req.body.source;

  try {
    const client = await pgPool.connect();
    await client.query('INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4)', [nom,prix,description,source]);
    client.release();
    res.status(201).send('Produit ajouté');
  } catch (error) {
    console.error('Erreur ajout produit', error);
    res.status(500).send('Erreur ajout produit');
  }
})


app.listen(port,host,() => {
  console.log(`API en écoute sur http://${host}:${port}`);
});
