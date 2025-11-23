import { useQuery } from "@tanstack/react-query";
import { getSpacificCategory } from "./categoriesFunctions";

const useGetSpecificCategory = (categoryId) => {
    return useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getSpacificCategory(categoryId),
        enabled: !!categoryId,
        refetchInterval: 1000,
        staleTime: 5000
    })
}

export default useGetSpecificCategory