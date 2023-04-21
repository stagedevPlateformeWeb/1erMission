class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this._listeners = [];
  }

  _notify() {
    this._listeners.forEach((listener) => listener());
  }

  on(event, callback) {
    if (event === 'change') {
      this._listeners.push(callback);
    }
  }

  addItem(product, quantity) {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(this.items));
    this._triggerEvent('change', { product, quantity });
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.items));
    this._triggerEvent('change');
  }

  updateItemQuantity(productId, quantity) {
    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(this.items));
      this._triggerEvent('change');
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
    this._triggerEvent('change');
  }

  _triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

const cart = new Cart();
