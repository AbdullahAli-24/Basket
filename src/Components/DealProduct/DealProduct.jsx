import { Rating } from '@mui/material';
import Timer from '../Timer/Timer';
import useAddToCart from '../../Hooks/cart/useAddToCart';
import { getCurrentUser } from '../../lib/auth';

function DealProduct({id, image, title, quantity, rate, price, discountPrice, discount})
{
    const addToCartMutation = useAddToCart();
    const currentUser = getCurrentUser();

    const handleAddToCart = () => {
        if (!currentUser) {
            if (window.confirm("Please login first to add items to cart. Go to login page?")) {
                window.location.href = "/login";
            }
            return;
        }
        if (id) {
            addToCartMutation.mutate(id);
        }
    };

    // JSX
    return (
        <>
            {/* Deal Product */}
            <div className="grid row-span-2 min-[440px]:col-span-2 p-6 border-2 border-[#ED174A] rounded-[7px]">
                {/* Deal Title */}
                <h1 className="text-[20px] text-[#233A95] leading-6">
                    Deals of the <span className="font-bold">week!</span>
                </h1>
                {/* Deal Timer */}
                <Timer timerDays={70} timerHours={14} timerMinutes={41} timerSeconds={11}/>
                {/* Deal Message */}
                <p className="text-[#C2C2D3] text-[12px]">Remains until the end of the offer</p>
                {/* Product Image & Discount */}
                <div className="relative mt-7 mb-4 justify-self-center">
                    {/* Product Image */}
                    <img src={image} alt={title} className="w-full h-auto"/>
                    {/* Product Discount */}
                    {discount > 0 && (
                        <span className="size-[70px] bg-[#ED174A] text-white text-[24px] text-center leading-[70px] font-semibold rounded-full absolute top-0 font-['Dosis']">
                            {discount}%
                        </span>
                    )}
                </div>
                {/* Product Price */}
                <div>
                    {/* Old Price */}
                    {price && price !== discountPrice && (
                        <span className="text-[#C2C2D3] text-[20px] font-semibold line-through mr-2 font-['Dosis']">
                            ${price}
                        </span>
                    )}
                    {/* New Price */}
                    <span className="text-[#D51243] text-[24px] font-semibold font-['Dosis']">
                        ${discountPrice}
                    </span>
                </div>
                {/* Product Title */}
                <h3 className="text-[#202435] text-[18px] font-medium my-2">{title}</h3>
                {/* Product Quantity */}
                <p className="text-[#00B853] text-[11px] font-semibold uppercase">{quantity} in stock</p>
                {/* Product Review */}
                <div className="flex items-center gap-x-2 my-3">
                    <Rating value={rate} readOnly size='small'/>
                    <span className="text-[#71778E] text-[13px] font-semibold">1 Review</span>
                </div>
                {/* Product Avalability */}
                <div>
                    {/* Avalability Count */}
                    <p className="text-[#C2C2D3] text-[11px] text-end font-semibold uppercase mb-2">
                        Available: <span className="text-[#233A95] text-[16px]">{quantity}</span>
                    </p>
                    {/* Avalability Bar */}
                    <div style={{"--avalable": `${quantity}%`}} className={`relative h-[10px] bg-[#EDEEF5] rounded-[12px] before:absolute before:w-[var(--avalable)] before:h-[10px] before:bg-linear-to-r before:from-[#D51243] before:via-[#FF6048] before:to-[#FFCD00] before:rounded-[12px]`}></div>
                </div>
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || quantity === 0}
                    className={`w-full mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                        quantity === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#35AFA0] hover:bg-[#2a8f82] cursor-pointer'
                    }`}
                >
                    {addToCartMutation.isPending ? 'Adding...' : quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </>
    );
}

export default DealProduct;
