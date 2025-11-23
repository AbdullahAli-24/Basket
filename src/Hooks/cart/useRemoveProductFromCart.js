import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProductFromCart } from "./cartFunctions";
import { getCurrentUserId } from "../../lib/auth";
import toast from "react-hot-toast";

const useRemoveProductFromCart = () => {
    const queryClient = useQueryClient();
    const userId = getCurrentUserId();

    const mutation = useMutation({
        mutationFn: (productId) => {
            if (!userId) {
                throw new Error("Please login first");
            }
            return removeProductFromCart(userId, productId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item removed from cart ✅");
        },
        onError: (error) => {
            console.error("Error removing from cart:", error);
            toast.error(error.message || "Failed to remove item from cart ❌");
        },
    })

    return mutation
}

export default useRemoveProductFromCart