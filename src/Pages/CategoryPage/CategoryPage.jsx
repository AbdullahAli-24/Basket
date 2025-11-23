import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Product from '../../Components/Product/Product';
import useGetProducts from '../../Hooks/products/useGetProducts';
import useGetSpecificCategory from '../../Hooks/categories/useGitSpacificCategory';

function CategoryPage() {
    const { categoryId } = useParams();
    
    // Get category details
    const { data: category, isLoading: categoryLoading } = useGetSpecificCategory(categoryId);

    // Get all products
    const { data: allProducts, isLoading: productsLoading } = useGetProducts();

    // Filter products by category
    const numericCategoryId = parseInt(categoryId, 10);
    const categoryProducts = allProducts?.filter(
        product => product.category_id === numericCategoryId
    ) || [];

    // Calculate discounts
    const productsDiscounts = categoryProducts.map((product) => {
        const discount = Math.trunc(((product.discount_price - product.price) / product.discount_price) * 100);
        return {
            product_id: product.id,
            discount: discount
        };
    });

    if (categoryLoading || productsLoading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                <p className="text-gray-600">The category you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="container xl:max-w-6xl mx-auto p-4">
            {/* Back Button */}
            <Link 
                to="/" 
                className="inline-flex items-center text-[#35AFA0] hover:text-[#2a8f82] mb-4"
            >
                ← Back to Home
            </Link>
            
            {/* Category Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    {category["image-url"] && (
                        <img 
                            src={category["image-url"]} 
                            alt={category.name} 
                            className="w-20 h-20 object-cover rounded"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
                        <p className="text-gray-600">
                            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {categoryProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 min-[440px]:grid-cols-2 min-md:grid-cols-3 min-lg:grid-cols-4 min-xl:grid-cols-5 gap-4">
                    {categoryProducts.map((product) => {
                        const productDiscount = productsDiscounts.find(
                            (pd) => pd.product_id === product.id
                        )?.discount || 0;
                        
                        return (
                            <Product
                                key={product.id}
                                id={product.id}
                                image={product["image-url"]}
                                title={product.name}
                                quantity={product.stock_qty}
                                rate={product.rating}
                                price={product.discount_price}
                                discountPrice={product.price}
                                discount={productDiscount}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CategoryPage;

