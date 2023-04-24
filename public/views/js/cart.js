class Cart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }
  
    addItem(product, quantity) {
      const existingItem = this.items.find((item) => item.product.id === product.id);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
  
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  
    removeItem(productId) {
      this.items = this.items.filter((item) => item.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  
    updateItemQuantity(productId, quantity) {
      const item = this.items.find((item) => item.product.id === productId);
  
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    }
  
    getItems() {
      return this.items;
    }
  
    getTotal() {
      return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }
  
    clear() {
      this.items = [];
      localStorage.removeItem('cart');
    }
  }
  
  const cart = new Cart();
  
  