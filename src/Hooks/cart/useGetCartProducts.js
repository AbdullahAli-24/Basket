
import { useQuery } from '@tanstack/react-query';
import { getCartProducts } from './cartFunctions';
import { getCurrentUserId } from '../../lib/auth';

const useGetCartProducts = () => {
  const userId = getCurrentUserId();
  const cartProducts = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCartProducts(userId),
    enabled: !!userId,
    refetchInterval: 1000,
    staleTime: 5000,
  });
  return cartProducts;
}

export default useGetCartProducts