import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const url = path.startsWith("/api") ? path : `/api${path}`;
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
}