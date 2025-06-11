import useScrollToTop from "../hooks/ScrollToTop";
import PlasticCartList from "../layouts/product/PlasticCartList";


interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = (props) => {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

    return <PlasticCartList/>;
};

export default CartPage;
