import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/pagination";
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation , Autoplay , Pagination } from 'swiper/modules';
import { MdOutlineArrowRightAlt } from "react-icons/md";
import discount1 from '../../assets/images/discount1.png'
import discount2 from '../../assets/images/discount2.png'
import discount3 from '../../assets/images/discount3.png'
import discount4 from '../../assets/images/discount4.png'
import discount5 from '../../assets/images/discount5.png'
import article1 from '../../assets/images/article1.png'
import article2 from '../../assets/images/article2.png'
import article3 from '../../assets/images/article3.png'
import promo1 from '../../assets/images/promo1.jpg'
import promo2 from '../../assets/images/promo2.png'
import Category from '../../Components/Category/Category';
import DealProduct from '../../Components/DealProduct/DealProduct';
import Product from '../../Components/Product/Product';
import Discount from '../../Components/Discount/Discount';
import Article from '../../Components/Article/Article';
import Promo from '../../Components/Promo/Promo';
import useGetProducts from "../../Hooks/products/useGetProducts";
import useGetCategories from "../../Hooks/categories/useGetCategories";

function Home()
{
    // Get Products
    const { data: products, isLoading, isError, error } = useGetProducts();
    // Get Categories
    const { data: categories , isLoading: categoriesIsLoading } = useGetCategories();

    if (isLoading || categoriesIsLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    if (!products || products.length === 0) {
        return <div>No data</div>;
    }

    // Get Categories Items Count
    function getcategoriesItemsCount()
    {
        let categoriesItems = [];
        // Iterate Over All Categories
        categories.map((category)=>{
            // Iterate Over All Products And Get The Count Of Products That Belong To Our Category
            categoriesItems = [
                ...categoriesItems,
                {
                    category_id : category.id,
                    categoryItemsCount : products.filter((product)=>{
                            return product.category_id === category.id
                        }).length
                }
            ]} 
        )
        return categoriesItems;
    }

    // Get Products Discounts Function
    function getproductsDiscounts()
    {
        let productsDiscounts = [];
        // Iterate Over All Products
        products.map((product)=>{
            // Calculate Discount Percentage For Each Product
            let productDiscount =  Math.trunc(((product.discount_price-product.price)/product.discount_price)*100);
            productsDiscounts = [
                ...productsDiscounts,
                {
                    product_id : product.id,
                    discount : productDiscount
                }
            ];
        })
        return productsDiscounts;
    }

    let categoriesItems = getcategoriesItemsCount()
    let productsDiscounts = getproductsDiscounts()

    // JSX
    return (
        <>
            {/* Home */}
            <div className='font-["Inter"]'>
                {/* Promos Section */}
                <div className='mb-10'>
                    <Swiper
                        modules={[Navigation , Autoplay, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        autoplay={{
                            delay: 3000,
                            pauseOnMouseEnter: true,
                        }}
                        speed={1500}
                    >
                            <SwiperSlide><Promo image={promo1}/></SwiperSlide>
                            <SwiperSlide><Promo image={promo2}/></SwiperSlide>
                    </Swiper>
                </div>
                {/* Main Section */}
                <div className='container xl:max-w-6xl mx-auto'>
                    {/* Categories Section */}
                    <div className="grid grid-cols-2 min-md:grid-cols-3 min-lg:grid-cols-4 min-xl:grid-cols-5 mb-10">
                        {
                            // Iterate Over All Categories
                            categories.map((category)=>{
                                // Iterate Over All CategoriesItems Array And Return The CategoryItems That Match Our Category And Return Items Count From It
                                let categoryItemsCount = categoriesItems.find((categoryItems)=>{
                                    return categoryItems.category_id === category.id
                                })?.categoryItemsCount || 0;
                                return <Category key={category.id} id={category.id} image={category["image-url"]} title={category.name} itemsCount={categoryItemsCount}/>
                            })
                        }
                    </div>
                    {/* Products Section */}
                    <div className='grid grid-cols-1 min-[440px]:grid-cols-2 min-md:grid-cols-3 min-lg:grid-cols-4 min-xl:grid-cols-5 mb-10'>
                        {products[0] && (
                            <DealProduct 
                                id={products[0].id} 
                                image={products[0]["image-url"]} 
                                title={products[0].name} 
                                quantity={products[0].stock_qty} 
                                rate={products[0].rating} 
                                price={products[0].discount_price} 
                                discountPrice={products[0].price} 
                                discount={productsDiscounts[0]?.discount || 0}
                            />
                        )}
                        {
                            products.slice(0,6).map((product)=>{
                                let productDiscount = productsDiscounts.find((productDiscount)=>{
                                    return productDiscount.product_id === product.id
                                })?.discount || 0;
                                return <Product key={product.id} id={product.id} image={product["image-url"]} title={product.name} quantity={product.stock_qty} rate={product.rating} price={product.discount_price} discountPrice={product.price} discount={productDiscount}/>
                            })
                        }
                    </div>
                    {/* Discounts Section */}
                    <div className='grid grid-cols-1 min-md:grid-cols-2 gap-8 mb-10'>
                        <Discount image={discount1} title={"Cookie and Ice Cream"} desc={"Bacola Weekend Discount"}/>
                        <Discount image={discount2} title={"Cookie and Ice Cream"} desc={"Bacola Weekend Discount"}/>
                    </div>
                    {/* Best Sellers Section */}
                    <div className='mb-10'>
                        {/* Header */}
                        <div className='flex justify-between mb-10'>
                            {/* Title */}
                            <div>
                                <h3 className='text-[#202435] text-[20px] font-semibold uppercase'>Best Sellers</h3>
                                <p className='text-[#9B9BB4] text-[12px]'>Do not miss the current offers until the end of March.</p>
                            </div>
                            {/* Link */}
                            <div>
                                <a href="#" className='text-[#9B9BB4] text-[12px] font-medium rounded-[30px] border border-[#D9D9E9] flex items-center gap-x-1.5 px-5 py-2'>
                                    View All <MdOutlineArrowRightAlt className='text-[20px]' />
                                </a>
                            </div>
                        </div>
                        {/* Products */}
                        <Swiper
                                className='w-full'
                                modules={[Navigation , Autoplay]}
                                navigation
                                slidesPerView={5}
                                slidesPerGroup={5}
                                breakpoints={{
                                    1280: {
                                        slidesPerView: 5,
                                        slidesPerGroup:5
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 4
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        slidesPerGroup: 3
                                    },
                                    440: {
                                        slidesPerView: 2,
                                        slidesPerGroup: 2
                                    },
                                    0: {
                                        slidesPerView: 1,
                                        slidesPerGroup: 1
                                    },
                                }}
                                autoplay={{
                                    delay: 3000,
                                    pauseOnMouseEnter: true,
                                }}
                                speed={1500}
                            >
                                {
                                    products.filter((product)=>{
                                        return product.category_id === 6
                                    }).map((product)=>{
                                        let productDiscount = productsDiscounts.find((productDiscount)=>{
                                            return productDiscount.product_id === product.id
                                        })?.discount || 0;
                                        return <SwiperSlide key={product.id}>
                                            <Product id={product.id} image={product["image-url"]} title={product.name} quantity={product.stock_qty} rate={product.rating} price={product.discount_price} discountPrice={product.price} discount={productDiscount}/>
                                            </SwiperSlide>
                                    })
                                }
                        </Swiper>
                    </div>
                    {/* Super Discounts Section */}
                    <div className='mb-10'>
                        {/* Header */}
                        <h1 className='bg-[#FBEACF] text-[#202435] text-[16px] font-bold rounded-[7px] tracking-[4px] text-center uppercase py-5 mb-10'>
                            Super discount for your <span className='font-black'>first purchase</span>.
                        </h1>
                        {/* Products */}
                        <div className='grid grid-cols-1 min-[440px]:grid-cols-2 min-md:grid-cols-3 min-lg:grid-cols-4 min-xl:grid-cols-5'>
                        {
                            productsDiscounts.sort((a, b) => b.discount - a.discount).slice(0,10).map((productDiscount)=>{
                                let product = products.find((product)=>{
                                    return product.id === productDiscount.product_id
                                })
                                if (!product) return null;
                                return <Product key={product.id} id={product.id} image={product["image-url"]} title={product.name} quantity={product.stock_qty} rate={product.rating} price={product.discount_price} discountPrice={product.price} discount={productDiscount.discount}/>
                            })
                        }
                        </div>
                    </div>
                    {/* Discounts Section */}
                    <div className='grid grid-cols-1 min-md:grid-cols-2 min-xl:grid-cols-3 gap-8 mb-10'>
                        <Discount image={discount3} title={"Natural Eggs"} desc={"Eat one every day"}/>
                        <Discount image={discount4} title={"Taste the Best"} desc={"Shine the morning"}/>
                        <Discount image={discount5}  title={"Ditch the Junk"} desc={"Breakfast made better"}/>
                    </div>
                    {/* Articles Section */}
                    <div className='grid grid-cols-1 min-md:grid-cols-2 min-xl:grid-cols-3 gap-8 mb-10'>
                        <Article image={article1} category={"Grocery"} title={"But I must explain to you how all this mistaken idea"} date={"Jan 13 2025"}/>
                        <Article image={article2} category={"Grocery"} title={"The Problem With Typefaces on the Web"} date={"Jan 13 2025"}/>
                        <Article image={article3} category={"Grocery"} title={"English Breakfast Tea With Tasty Donut Desserts"} date={"Jan 13 2025"}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;