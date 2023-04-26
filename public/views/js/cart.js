/**
 * Classe Cart pour gérer le panier d'achat.
 * Utilise le localStorage pour conserver les articles ajoutés au panier.
 */
class Cart {
  /**
   * Constructeur de la classe Cart.
   * Initialise les articles du panier à partir du localStorage ou un tableau vide si le localStorage est vide.
   */
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

  /**
   * Ajoute un produit au panier avec une certaine quantité.
   * @param {Object} product - Le produit à ajouter au panier.
   * @param {number} quantity - La quantité du produit à ajouter.
   */
  addItem(product, quantity) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  /**
   * Supprime un article du panier en fonction de son ID de produit.
   * @param {number} productId - L'ID du produit à supprimer du panier.
   */
  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  /**
   * Met à jour la quantité d'un article dans le panier en fonction de son ID de produit.
   * @param {number} productId - L'ID du produit dont la quantité doit être mise à jour.
   * @param {number} quantity - La nouvelle quantité pour le produit.
   */
  updateItemQuantity(productId, quantity) {
    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }

  /**
   * Récupère les articles du panier.
   * @returns {Array} Un tableau d'objets contenant les informations sur les produits et les quantités dans le panier.
   */
  getItems() {
    return this.items;
  }

  /**
   * Calcule le montant total du panier.
   * @returns {number} Le montant total du panier.
   */
  getTotal() {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  /**
   * Vide le panier et supprime les informations du panier du localStorage.
   */
  clear() {
    this.items = [];
    localStorage.removeItem('cart');
  }
}

// Crée une instance de la classe Cart
const cart = new Cart();