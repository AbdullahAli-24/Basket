

import imgCam from '../../assets/cam.png'
import { Link } from 'react-router-dom'
import useGetCartProducts from '../../Hooks/cart/useGetCartProducts.js'
import { getCurrentUser } from '../../lib/auth.js'

export default function Checkout() {
    const { data: cartData, isLoading, isError } = useGetCartProducts();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return (
            <div className='max-w-5xl mx-auto text-center p-8'>
                <h2 className="text-2xl font-semibold mb-4">Please Login First</h2>
                <p className="text-gray-600 mb-4">You need to be logged in to checkout.</p>
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
        return <div className='max-w-5xl mx-auto text-center p-8 text-red-500'>Error loading cart.</div>;
    }

    const cartItems = cartData?.cart_items || [];
    const isEmpty = cartItems.length === 0;

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
        const product = item.products;
        const price = product?.discount_price || product?.price || 0;
        return total + (price * item.quantity);
    }, 0);
    
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (isEmpty) {
        return (
            <div className='max-w-5xl mx-auto text-center p-8'>
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                <Link to="/" className="px-4 py-2 rounded-md bg-[#35AFA0] text-white inline-block">
                    Continue Shopping
                </Link>
            </div>
        );
    }
    return (
        <>
            <section className="max-w-7xl mx-auto p-4">
                {/* form contact */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* form */}
                    <div className=' w-full p-5'>

                        <div className="w-full border-r border-[#DEDEDE] pr-6">
                            <h2 className="font-semibold text-xl pb-2 text-black">Contact</h2>
                            <form>
                                <div className="my-4">
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="email" 
                                        placeholder="Email or mobile phone number" 
                                        required 
                                        type="email"
                                        defaultValue={currentUser?.email || ""}
                                    />
                                </div>
                                <div className="my-4">
                                    <input className='h-4 w-4 me-2 cursor-pointer' id='emailCheck' type="checkbox" />
                                    <label className='text-sm cursor-pointer' htmlFor="emailCheck">Email me with news and offers</label>
                                </div>
                                <div className="mt-14">
                                    <h2 className="font-semibold text-xl pb-2">Delivery</h2>
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-4">
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="firstName" 
                                        placeholder="First Name (Optional)" 
                                        type="text"
                                    />
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="lastName" 
                                        placeholder="Last Name" 
                                        type="text"
                                    />
                                </div>
                                
                                <div className="my-4">
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="address" 
                                        placeholder="Address" 
                                        type="text"
                                    />
                                </div>
                                <div className="my-4">
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="apartment" 
                                        placeholder="Apartment, suite, etc. (Optional)" 
                                        type="text"
                                    />
                                </div>

                                <div className="w-full flex flex-col md:flex-row gap-4">
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="postalCode" 
                                        placeholder="Postal Code (Optional)" 
                                        type="text"
                                    />
                                    <input 
                                        className="shadow border-[#DEDEDE] border-[1px] rounded w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1773B0] focus:border-[#1773B0]" 
                                        id="city" 
                                        placeholder="City" 
                                        type="text"
                                    />
                                </div>

                                <div className="my-4">
                                    <input className='h-4 w-4 me-2 cursor-pointer' id='saveForm' type="checkbox" />
                                    <label className='text-sm cursor-pointer' htmlFor="saveForm">Save this information for next time</label>
                                </div>

                                <div className="my-7">
                                    <h2 className="font-semibold text-xl pb-2">Shipping method</h2>
                                    <div className="flex justify-between items-center my-2 p-4 border-[3px] border-[#1773B0] rounded">
                                        <span>Standard</span>
                                        <span>free</span>
                                    </div>
                                </div>
                                
                                <div className="my-7">
                                    <div>
                                        <h2 className="font-semibold text-xl pb-2">Payment</h2>
                                        <p className="text-sm text-[#707070]">All transactions are secure and encrypted.</p>
                                    </div>
                                    <div className="my-4 p-4 bg-[#F5F5F5] flex justify-center items-center flex-col text-center rounded">
                                        <div className="mb-2">
                                            <img src={imgCam} alt="Payment Icon" className="w-20 h-20"/>                                                                                       
                                        </div>
                                        <p className="text-sm text-[#707070]">This store can't accept payments right now.</p>
                                    </div>
                                </div>

                                <div className="my-7">
                                    <Link to='/paymoney' className="w-full block text-center bg-[#F5F5F5] text-gray-700 text-sm font-bold py-4 rounded cursor-pointer border border-[#DEDEDE] hover:bg-[#e0e0e0] transition duration-200">Pay Now</Link>
                                </div>

                            </form>
                        </div>

                    </div>

                    {/* cart items */}
                    <div className='p-5'>
                        <h2 className="font-semibold text-xl pb-4 text-black">Order Summary</h2>
                        {cartItems.map((item) => {
                            const product = item.products;
                            if (!product) return null;
                            
                            const price = product.discount_price || product.price || 0;
                            const itemTotal = price * item.quantity;
                            const imageUrl = product["image-url"] || product.image_url || '/logo.jpg';

                            return (
                                <div key={item.id} className='p-2 my-1 max-w-[800px] flex justify-between items-center border-b pb-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='h-16 w-16 border border-[#DEDEDE] rounded shadow-[2px_4px_4px_0_rgba(0,0,0,0.50)] relative'>
                                            <img className='object-cover w-full h-full rounded' src={imageUrl} alt={product.name || "Product"}/>
                                            <span className="bg-[#4B4B4B] text-white flex justify-center items-center h-7 w-7 rounded-full absolute top-[-10px] right-[-10px] text-xs">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <p className="font-semibold">{product.name || "Product"}</p>
                                    </div>

                                    <div className='w-fit'>
                                        <span className="font-medium">${itemTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className='p-2 max-w-[800px]'>
                            <div className="flex justify-between items-center pt-4">
                                <p className="font-medium">
                                    Subtotal: <span>{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
                                </p>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="font-medium">Shipping:</span>
                                <span className="font-medium">FREE</span>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="font-medium">Tax:</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-7 border-t">
                                <span className="text-2xl font-bold">Total</span>
                                <span className="font-semibold">
                                    <span className="text-gray-500">USD </span> ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    )
}


