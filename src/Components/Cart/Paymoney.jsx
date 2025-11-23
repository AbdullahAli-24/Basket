import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetCartProducts from '../../Hooks/cart/useGetCartProducts.js';
import { getCurrentUser } from '../../lib/auth.js';
import { toast } from 'react-hot-toast';

export default function Paymoney() {
    const { data: cartData, isLoading } = useGetCartProducts();
    const currentUser = getCurrentUser();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!currentUser) {
        return (
            <div className='max-w-5xl mx-auto text-center p-8'>
                <h2 className="text-2xl font-semibold mb-4">Please Login First</h2>
                <p className="text-gray-600 mb-4">You need to be logged in to make a payment.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className='max-w-5xl mx-auto text-center p-8'>Loading...</div>;
    }

    const cartItems = cartData?.cart_items || [];
    const isEmpty = cartItems.length === 0;

    // Calculate total
    const subtotal = cartItems.reduce((total, item) => {
        const product = item.products;
        const price = product?.discount_price || product?.price || 0;
        return total + (price * item.quantity);
    }, 0);
    
    const shipping = 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    if (isEmpty) {
        return (
            <div className='max-w-5xl mx-auto text-center p-8'>
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            toast.success("Payment successful! Order placed.");
            navigate("/");
        }, 2000);
    };

    return (
        <div>
            <div className="bg-gray-50 py-12 px-4 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                            <p className="mt-2 text-gray-600">Total: ${total.toFixed(2)}</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex border-b">
                                <span className="py-2 px-4 font-medium text-blue-600 border-b-2">Credit Card</span>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name" className='text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                                <input 
                                    id='name' 
                                    type="text" 
                                    name='name' 
                                    required 
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500'
                                    defaultValue={currentUser?.username || ""}
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className='text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input 
                                    id='email' 
                                    type="email" 
                                    name='email' 
                                    required 
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500'
                                    defaultValue={currentUser?.email || ""}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Details
                                </label>
                                <div className="overflow-hidden w-full border border-gray-300 rounded-md flex items-center p-3 gap-2">
                                    <span className="text-gray-400">
                                        <i className="fa-regular fa-credit-card"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        placeholder="Card Number" 
                                        maxLength="16"
                                        pattern="[0-9]*"
                                        className="flex-1 placeholder:text-sm placeholder-gray-400 border-none outline-none" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="MM" 
                                        maxLength="2"
                                        pattern="[0-9]*"
                                        className="w-10 text-center placeholder:text-sm placeholder-gray-400 border-none outline-none"
                                    />
                                    <span className="text-gray-400">/</span>
                                    <input 
                                        type="text" 
                                        placeholder="YY" 
                                        maxLength="2"
                                        pattern="[0-9]*"
                                        className="w-10 text-center placeholder:text-sm placeholder-gray-400 border-none outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="CVC" 
                                        maxLength="3"
                                        pattern="[0-9]*"
                                        className="w-14 text-center placeholder:text-sm placeholder-gray-400 border-none outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="address.line1" className='text-sm font-medium text-gray-700 mb-1'>Street Address</label>
                                <input 
                                    id='address.line1' 
                                    type="text" 
                                    name='address.line1' 
                                    required 
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500'
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="address.city" className='text-sm font-medium text-gray-700 mb-1'>City</label>
                                    <input 
                                        id='address.city' 
                                        type="text" 
                                        name='address.city' 
                                        required 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.postal_code" className='text-sm font-medium text-gray-700 mb-1'>ZIP Code</label>
                                    <input 
                                        id='address.postal_code' 
                                        type="text" 
                                        name='address.postal_code' 
                                        required 
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                                    isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

