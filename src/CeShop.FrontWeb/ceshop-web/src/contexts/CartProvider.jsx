import { createContext, useState } from "react";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [checkoutList, setCheckoutList] = useState([]);
  const [checkoutTotal, setCheckoutTotal] = useState({
    productTotal: 0,
    price: 0,
  });
  const [purchaseId, setPurchaseId] = useState(0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        checkoutList,
        setCheckoutList,
        checkoutTotal,
        setCheckoutTotal,
        purchaseId,
        setPurchaseId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
