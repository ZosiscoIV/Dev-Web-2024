import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./cartClient";

describe("Cart component", () => {
  test("renders all items with correct quantities and total", () => {
    render(<Cart />);

    // Check some items
    expect(screen.getByText("Pomme")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByText(/Total :/)).toHaveTextContent("Total : 38.56€");
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
    // Mock window.confirm
    jest.spyOn(window, "confirm").mockReturnValue(true);

    render(<Cart />);
    const pommeInput = screen.getByDisplayValue("1");
    const subtractButton = screen.getAllByText("-")[0];

    fireEvent.click(subtractButton); // Triggers confirm because quantity goes to 0

    expect(pommeInput).not.toBeInTheDocument();
    window.confirm.mockRestore();
  });

  test("does not remove item if user cancels the confirm dialog", () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<Cart />);
    const subtractButton = screen.getAllByText("-")[0];

    fireEvent.click(subtractButton);

    expect(screen.getByText("Pomme")).toBeInTheDocument();
    window.confirm.mockRestore();
  });
});
