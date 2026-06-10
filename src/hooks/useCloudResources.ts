import { useQuery } from "@tanstack/react-query";
import { fetchCloudResources } from "../libs/api";

export function useCloudResources() {
  return useQuery({
    queryKey: ["cloud-resources"],
    queryFn: fetchCloudResources,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
