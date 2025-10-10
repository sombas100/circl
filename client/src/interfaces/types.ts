export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar_url?: string | null;
}

export type Post = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    user: User
}

export type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
}