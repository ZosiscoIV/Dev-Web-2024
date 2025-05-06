import Header from "../main/components/Header";

export const metadata = {
    title: "Mon Panier",
  };
  
  import Cart from "../cart/cartClient";

  
  export default function CartPage() {
    return (
        <div>
          <Header />
          <main>
            <Cart />
          </main>
        </div>
    );
  }
  