import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./cartClient";
import React from 'react';

describe("Cart component", () => {
  test("renders all items with correct quantities and total", () => {
    render(<Cart />);

    // Check some items
    expect(screen.queryByText("Pomme")).not.toBeNull();
    expect(screen.queryByDisplayValue("1")).not.toBeNull();
    expect(screen.queryByText(/Total :/).textContent).toBe("Total : 38.56€");
  });

  test("increases quantity when + button is clicked", () => {
    render(<Cart />);
    const addButtons = screen.getAllByText("+");
    const quantityInput = screen.getByDisplayValue("1");

    fireEvent.click(addButtons[0]);

    // Now quantity should be 2
    expect(quantityInput.value).toBe("2");
  });

  test("decreases quantity when - button is clicked", () => {
    render(<Cart />);
    const subtractButtons = screen.getAllByText("-");
    const poireInput = screen.getByDisplayValue("2");

    fireEvent.click(subtractButtons[1]);

    expect(poireInput.value).toBe("1");
  });

  test("removes item from cart when quantity is 0 and user confirms", () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Cart />);
    const subtractButton = screen.getAllByText("-")[0];
    fireEvent.click(subtractButton);

    // Pomme should be removed
    expect(screen.queryByDisplayValue("1")).toBeNull();

    window.confirm.mockRestore();
  });

  test("does not remove item if user cancels the confirm dialog", () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<Cart />);
    const subtractButton = screen.getAllByText("-")[0];

    fireEvent.click(subtractButton);

    expect(screen.queryByText("Pomme")).not.toBeNull();
    window.confirm.mockRestore();
  });
});

test("directly changes quantity using input field", () => {
  render(<Cart />);
  const input = screen.getByDisplayValue("1"); // Pomme

  fireEvent.change(input, { target: { value: "5" } });

  expect(input.value).toBe("5");
  expect(screen.queryByText(/Total :/).textContent).toBe("Total : 50.06€");
});

test("prevents quantity from exceeding stock", () => {
  render(<Cart />);
  const input = screen.getByDisplayValue("1"); // Pomme
  const addButton = screen.getAllByText("+")[0];

  for (let i = 0; i < 15; i++) {
    fireEvent.click(addButton);
  }

  expect(input.value).toBe("10"); // stock limit
});

test("shows alert when exceeding stock manually", () => {
    window.alert = jest.fn();
    render(<Cart />);
  
    const inputs = screen.getAllByDisplayValue("1");
    const input = inputs[0]; // targeting the input for "Pomme"
  
    fireEvent.change(input, { target: { value: "100" } });
  
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("stock")
    );
  });
  

test("updates total dynamically when quantities change", () => {
  render(<Cart />);
  const inputs = screen.getAllByDisplayValue("1");
  const input = inputs[0]; // Pomme
  const addButton = screen.getAllByText("+")[0];

  fireEvent.click(addButton); // now 2
  fireEvent.click(addButton); // now 3

  expect(input.value).toBe("3");
  expect(screen.queryByText(/Total :/).textContent).toBe("Total : 40.86€");
});
  


test("renders correctly when cart becomes empty", () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  render(<Cart />);

  // Remove every item
  const removeAll = () => {
    let subtractButtons = screen.queryAllByText("-");
    while (subtractButtons.length > 0) {
      fireEvent.click(subtractButtons[0]);
      subtractButtons = screen.queryAllByText("-");
    }
  };

  removeAll();

  expect(screen.queryByText("Mon Panier")).not.toBeNull();
  expect(screen.queryByText(/Total :/).textContent).toBe("Total : 0.00€");

  window.confirm.mockRestore();
});
