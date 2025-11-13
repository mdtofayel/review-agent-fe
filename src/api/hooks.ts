import { useQuery } from "@tanstack/react-query";
import { API } from ".";

// shared hook so Navbar, Search, FilterSheet use the same cache
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => API.getCategories(),
    staleTime: 5 * 60 * 1000, // five minutes cache is fine for categories
  });
}
