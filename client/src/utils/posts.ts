import { api } from "../api/axios";
import type { Post, Pagination } from "../interfaces/types";

export async function getPosts(page = 1): Promise<Pagination<Post>> {
   const { data } = await api.get<Pagination<Post>>(`/feed?page=${page}`)
   
   return data;
}

export async function createPost(content: string) {
   const { data } = await api.post<Post>('/posts', { content });

   return data;
}

export async function deletePost(id: number) {
   const { data } = await api.put<number>(`/posts/${id}`)

   return data;
}