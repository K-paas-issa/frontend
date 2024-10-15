import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface CommentRequest {
  id: number;
  size: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

interface CommentResponse {
  content: Comment[];
  page: Page;
}

export function useCommentApi(params: CommentRequest) {
  return useInfiniteQuery({
    queryKey: [`getCommentList`, params.id],
    queryFn: ({ pageParam }) =>
      httpClient<CommentResponse>({
        method: "GET",
        url: `/balloons/${params.id}/comments?page=${pageParam - 1}&size=${params.size}`,
      }),
    initialPageParam: 1,
    getNextPageParam: (data, allPages) => (allPages.length < data.page.totalPages ? allPages.length + 1 : undefined),
  });
}

export function useCreateCommentApi(params: { id: number }) {
  return useMutation({
    mutationFn: (data: { content: string }) =>
      httpClient({
        method: "POST",
        url: `/balloons/${params.id}/comments`,
        data: data,
      }),
  });
}
