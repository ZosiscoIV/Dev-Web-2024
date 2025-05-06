// cartUtils.test.js
import { handleQuantityChange, handleAdjust } from './cartUtils';

describe('handleQuantityChange', () => {
  const item = { id: 1, name: "Pomme", price: 2.5, quantity: 1, stock: 10 };

  test('change quantity within stock', () => {
    const updated = handleQuantityChange(item, 5);
    expect(updated.quantity).toBe(5);
  });

  test('caps quantity at stock limit', () => {
    const updated = handleQuantityChange(item, 20);
    expect(updated.quantity).toBe(10);
  });

  test('does not allow negative quantities', () => {
    const updated = handleQuantityChange(item, -3);
    expect(updated.quantity).toBe(0);
  });
});

describe('handleAdjust', () => {
  const initialCart = [
    { id: 1, name: "Pomme", price: 2.5, quantity: 1, stock: 10 },
    { id: 2, name: "Poire", price: 3, quantity: 2, stock: 5 }
  ];

  test('increases quantity within stock', () => {
    const updatedCart = handleAdjust(initialCart, 1, 1, jest.fn(), jest.fn());
    expect(updatedCart.find(item => item.id === 1).quantity).toBe(2);
  });

  test('prevents increasing beyond stock', () => {
    const alertMock = jest.fn();
    const cart = [{ id: 1, name: "Pomme", price: 2.5, quantity: 10, stock: 10 }];
    handleAdjust(cart, 1, 1, jest.fn(), alertMock);
    expect(alertMock).toHaveBeenCalledWith("Pas assez de stock.");
  });

  test('removes item if quantity reaches 0 and user confirms', () => {
    const confirmMock = jest.fn(() => true);
    const updated = handleAdjust(initialCart, 1, -1, confirmMock, jest.fn());
    expect(updated.find(item => item.id === 1)).toBeUndefined();
  });

  test('keeps item with quantity 1 if user cancels confirm', () => {
    const confirmMock = jest.fn(() => false);
    const updated = handleAdjust(initialCart, 1, -1, confirmMock, jest.fn());
    expect(updated.find(item => item.id === 1).quantity).toBe(1);
  });
});
