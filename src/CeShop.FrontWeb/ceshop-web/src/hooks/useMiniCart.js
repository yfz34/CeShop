import useAxiosPrivate from "./useAxiosPrivate";
import useCart from "./useCart";

const CART_MINI_URL = "/api/carts/mini";

const useMiniCart = () => {
    const { setCart } = useCart();
    const axiosPrivate = useAxiosPrivate();

    const getUserCart = () => {

        const fetchUserCart = async () => {
          try {
            const response = await axiosPrivate.get(CART_MINI_URL);
            setCart(response?.data);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchUserCart();
    
        return fetchUserCart;
    };

    return getUserCart;
}

export default useMiniCart;