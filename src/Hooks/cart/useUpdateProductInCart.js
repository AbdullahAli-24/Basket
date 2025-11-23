import { useQueryClient, useMutation } from "@tanstack/react-query"
import { updateProductInCart } from "./cartFunctions"
import { getCurrentUserId } from "../../lib/auth"
import toast from "react-hot-toast"


const useUpdateProductInCart = () => {
    const queryClient = useQueryClient();
    const userId = getCurrentUserId();

    const mutation = useMutation({
        mutationFn: ({ productId, quantity }) => {
            if (!userId) {
                throw new Error("Please login first");
            }
            return updateProductInCart(userId, productId, quantity);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item Updated ✅");
        },
        onError: (error) => {
            console.error("Error updating cart:", error);
            toast.error(error.message || "Failed to update quantity ❌");
        },
    })

    return mutation
}

export default useUpdateProductInCart