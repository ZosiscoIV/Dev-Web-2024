import { render, screen, fireEvent, within } from "@testing-library/react";
import Cart from "./cartClient";
import React from 'react';

describe("Cart component", () => {
  test("renders all items with correct quantities and total", () => {
    render(<Cart />);
    expect(screen.queryByText("Pomme")).not.toBeNull();
    expect(screen.getAllByDisplayValue("1")[0]).not.toBeNull();
    expect(screen.queryByText(/Total :/).textContent).toBe("Total : 35.86€");
  });

  test("increases quantity when + button is clicked", () => {
    render(<Cart />);
    const addButtons = screen.getAllByText("+");
    const quantityInput = screen.getAllByDisplayValue("1")[0];

    fireEvent.click(addButtons[0]);

    expect(quantityInput.value).toBe("2");
  });

  test("decreases quantity when - button is clicked", () => {
    render(<Cart />);
    const subtractButtons = screen.getAllByText("-");
    const poireInput = screen.getAllByDisplayValue("2")[0];

    fireEvent.click(subtractButtons[1]);

    expect(poireInput.value).toBe("1");
  });

  test("removes item from cart when quantity is 0 and user confirms", () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Cart />);
    const subtractButton = screen.getAllByText("-")[0];
    fireEvent.click(subtractButton);

    expect(screen.queryByText("Pomme")).toBeNull();
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
  const input = screen.getAllByDisplayValue("1")[0]; // Pomme

  fireEvent.change(input, { target: { value: "5" } });

  expect(input.value).toBe("5");
  expect(screen.queryByText(/Total :/).textContent).toBe("Total : 45.86€");
});

test("prevents quantity from exceeding stock", () => {
  render(<Cart />);
  const input = screen.getAllByDisplayValue("1")[0]; // Pomme
  const addButton = screen.getAllByText("+")[0];

  for (let i = 0; i < 15; i++) {
    fireEvent.click(addButton);
  }

  expect(input.value).toBe("10"); // stock limit
});

test("shows alert when exceeding stock manually", () => {
    window.alert = jest.fn(); // mock alert
  
    render(<Cart />);
  
    const input = screen.getAllByDisplayValue("1")[0]; // input for "Pomme"
  
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input); // <--- trigger onBlur logic
  
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("stock")
    );
  
    window.alert.mockRestore();
  });
  

test("updates total dynamically when quantities change", () => {
  render(<Cart />);
  const input = screen.getAllByDisplayValue("1")[0]; // Pomme
  const addButton = screen.getAllByText("+")[0];

  fireEvent.click(addButton); // now 2
  fireEvent.click(addButton); // now 3

  expect(input.value).toBe("3");
  expect(screen.queryByText(/Total :/).textContent).toBe("Total : 40.86€");
});

test("renders correctly when cart becomes empty", () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  render(<Cart />);

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
