import { Rating } from '@mui/material';
import useAddToCart from '../../Hooks/cart/useAddToCart';
import { getCurrentUser } from '../../lib/auth';

function Product({id, image, title, quantity, rate, price, discountPrice, discount})
{
    const addToCartMutation = useAddToCart();
    const currentUser = getCurrentUser();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            if (window.confirm("Please login first to add items to cart. Go to login page?")) {
                window.location.href = "/login";
            }
            return;
        }
        if (!id) {
            console.error("Product ID is missing!");
            alert("Product ID is missing. Cannot add to cart.");
            return;
        }
        console.log("Adding product to cart - Product ID:", id);
        addToCartMutation.mutate(id);
    };

    // JSX
    return (
        <>
            {/* Product */}
            <div className="grid border border-[#EDEEF5] p-5 hover:shadow-lg transition-shadow">
                {/* Product Image & Discount */}
                <div className="relative mb-4">
                    {/* Product Image */}
                    <img src={image} alt={title} className="w-full h-auto"/>
                    {/* Product Discount */}
                    {discount > 0 && (
                        <span className={`w-[45px] h-[25px] ${discount > 0 ? 'bg-[#35AFA0]' : 'bg-[#D51243]'} text-white text-[12px] text-center leading-[25px] font-semibold rounded-[4px] absolute top-0 font-['Dosis']`}>
                            {discount}%
                        </span>
                    )}
                </div>
                {/* Product Title */}
                <h3 className='mb-2 text-[14px] font-medium'>{title}</h3>
                {/* Product Quantity */}
                <p className="text-[#00B853] text-[11px] font-semibold uppercase">{quantity} in stock</p>
                {/* Product Review */}
                <div className="flex max-sm:flex-col max-sm:items-start items-center gap-x-2 my-3">
                    <Rating value={rate} readOnly size='small'/>
                    <span className="text-[#71778E] text-[13px] font-semibold">1 Review</span>
                </div>
                {/* Product Price */}
                <div className="mb-3">
                    {/* Old Price */}
                    {price && price !== discountPrice && (
                        <span className="text-[#C2C2D3] text-[15px] font-semibold line-through mr-2 font-['Dosis']">
                            ${price}
                        </span>
                    )}
                    {/* New Price */}
                    <span className="text-[#D51243] text-[18px] font-semibold font-['Dosis']">
                        ${discountPrice}
                    </span>
                </div>
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || quantity === 0}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                        quantity === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#35AFA0] hover:bg-[#2a8f82] cursor-pointer'
                    }`}
                >
                    {addToCartMutation.isPending ? 'Adding...' : quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </>
    )
}

export default Product;