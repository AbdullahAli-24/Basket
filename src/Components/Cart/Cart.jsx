
import { Link } from 'react-router-dom'
import useGetCartProducts from '../../Hooks/cart/useGetCartProducts.js'
import useRemoveProductFromCart from '../../Hooks/cart/useRemoveProductFromCart.js'
import useUpdateProductInCart from '../../Hooks/cart/useUpdateProductInCart.js'
import { getCurrentUser } from '../../lib/auth.js'

export default function Cart() {
    const { data: cartData, isLoading, isError } = useGetCartProducts();
    const removeMutation = useRemoveProductFromCart();
    const updateMutation = useUpdateProductInCart();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return (
            <div className='max-w-5xl mx-auto text-center p-8'>
                <h2 className="text-2xl font-semibold mb-4">Please Login First</h2>
                <p className="text-gray-600 mb-4">You need to be logged in to view your cart.</p>
                <Link to="/login" className="px-4 py-2 rounded-md bg-[#35AFA0] text-white inline-block">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return <div className='max-w-5xl mx-auto text-center p-8'>Loading...</div>;
    }

    if (isError) {
        return <div className='max-w-5xl mx-auto text-center p-8 text-red-500'>Error loading cart products.</div>;
    }

    const cartItems = cartData?.cart_items || [];
    const isEmpty = cartItems.length === 0;

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
        const product = item.products;
        const price = product?.discount_price || product?.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeMutation.mutate(productId);
        } else {
            updateMutation.mutate({ productId, quantity: newQuantity });
        }
    };

    const handleRemove = (productId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            removeMutation.mutate(productId);
        }
    };

    return (
        <>        
            <div className='max-w-5xl mx-auto text-sm text-gray-500 p-4'>
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
                
                {isEmpty ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
                        <Link to="/" className="px-4 py-2 rounded-md bg-[#35AFA0] text-white inline-block">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        {cartItems.map((item) => {
                            const product = item.products;
                            if (!product) return null;
                            
                            const price = product.discount_price || product.price || 0;
                            const itemTotal = price * item.quantity;
                            const imageUrl = product["image-url"] || product.image_url || '/logo.jpg';

                            return (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
                                    <div className="flex items-center justify-center sm:justify-start gap-4 w-full sm:w-1/4">
                                        <img 
                                            className="w-24 h-24 md:w-20 md:h-20 object-cover rounded" 
                                            src={imageUrl} 
                                            alt={product.name || "Product"} 
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 w-full sm:w-1/4">
                                        <button 
                                            className="w-8 h-8 border rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 disabled:opacity-50" 
                                            onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                                            disabled={updateMutation.isPending || removeMutation.isPending}
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[32px] text-center text-sm text-gray-700">{item.quantity}</span>
                                        <button 
                                            className="w-8 h-8 border rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 disabled:opacity-50" 
                                            onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                                            disabled={updateMutation.isPending || removeMutation.isPending}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className='text-gray-800 font-semibold w-full sm:w-1/4 text-center sm:text-left'>
                                        <p className="text-lg sm:text-xl font-semibold text-gray-600">${itemTotal.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">${price.toFixed(2)} each</p>
                                    </div>
                                    <div className="w-full sm:w-1/4 text-center sm:text-right">
                                        <button 
                                            className="text-red-500 text-sm hover:underline cursor-pointer disabled:opacity-50" 
                                            onClick={() => handleRemove(product.id)}
                                            disabled={removeMutation.isPending}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Summary and Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <Link 
                                    className='px-4 py-2 rounded-md bg-[#35AFA0] text-white text-center hover:bg-[#2a8f82] transition-colors' 
                                    to="/checkout"
                                >
                                    Checkout
                                </Link>
                                <Link 
                                    className='px-4 py-2 rounded-md bg-[#35AFA0] text-white text-center hover:bg-[#2a8f82] transition-colors' 
                                    to="/"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
                                <p className="text-lg sm:text-2xl font-semibold">Total Price:</p>
                                <p className="text-lg sm:text-2xl font-semibold text-[#35AFA0]">${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

