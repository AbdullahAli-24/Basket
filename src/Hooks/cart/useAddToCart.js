import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "./cartFunctions";
import { getCurrentUserId } from "../../lib/auth";
import toast from "react-hot-toast";

const useAddToCart = () => {
    const queryClient = useQueryClient();
    const userId = getCurrentUserId();

    const mutation = useMutation({
        mutationFn: (productId) => {
            if (!userId) {
                throw new Error("Please login first to add to cart");
            }
            return addToCart(userId, productId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item added to cart ✅");
        },
        onError: (error) => {
            console.error("Error adding to cart:", error);
            toast.error(error.message || "Failed to add item to cart ❌");
        },
    });

    return mutation;
};

export default useAddToCart;
