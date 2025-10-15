import { api } from "../api/axios";
import type { Comment, Pagination } from "../interfaces/types";

export async function getComments(postId: number, page = 1): Promise<Pagination<Comment>> {
    const { data } = await api.get<Pagination<Comment>>(`/posts/${postId}/comments?page=${page}`);

    return data;
}

export async function addNewComment(postId: number, content: string) {
    const { data } = await api.post<Comment>("/comments", { post_id: postId, content });

    return data;
}

export async function updateAnComment(commentId: number, content: string) {
    const { data } = await api.put<Comment>(`/comments/${commentId}`, { content });

    return data;
}

export async function deleteAnComment(commentId: number, postId: number) {
    await api.delete(`/comments/${commentId}`);
}