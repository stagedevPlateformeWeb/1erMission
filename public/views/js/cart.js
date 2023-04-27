/**
 * Represents a shopping cart.
 */
class Cart {


/**
   * Creates a new Cart instance.
   */
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

 
/**
 * Adds an item to the cart.
 * @param {Object} product - The product to add.
 * @param {number} quantity - The quantity of the product to add.
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
   * Removes an item from the cart.
   * @param {number} productId - The ID of the product to remove.
   */
  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

 
/**
 * Updates the quantity of an item in the cart.
 * @param {number} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity for the product.
 */
  updateItemQuantity(productId, quantity) {
    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }


 /**
   * Retrieves the items in the cart.
   * @returns {Array} - An array of cart items.
*/ 
  getItems() {
    return this.items;
  }


  /**
   * Calculates the total cost of items in the cart.
   * @returns {number} - The total cost of items in the cart.
   */
  getTotal() {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }


  /**
   * Clears the cart and removes its data from local storage.
   */ 
  clear() {
    this.items = [];
    localStorage.removeItem('cart');
  }
}

const cart = new Cart();