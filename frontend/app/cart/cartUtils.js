// cartUtils.js
export function handleQuantityChange(item, value) {
    if (value > item.stock) {
      value = item.stock;
    }
    const newQuantity = Math.max(0, Math.min(item.stock, value));
    return { ...item, quantity: newQuantity };
  }
  
  export function handleAdjust(cart, id, delta, confirmCallback = confirm, alertCallback = alert) {
    const item = cart.find((item) => item.id === id);
    const newQuantity = item.quantity + delta;
  
    if (newQuantity < 0) return cart;
  
    if (newQuantity > item.stock) {
      alertCallback("Pas assez de stock.");
      return cart;
    }
  
    if (newQuantity === 0) {
      if (confirmCallback("Souhaitez-vous retirer ce produit du panier ? (OK = oui, Annuler = non)")) {
        return cart.filter((item) => item.id !== id);
      } else {
        return cart.map((item) => item.id === id ? { ...item, quantity: 1 } : item);
      }
    }
  
    return cart.map((item) =>
      item.id === id ? handleQuantityChange(item, newQuantity) : item
    );
  }
  