import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { Post } from "../interfaces/types";
import { deletePosts } from "../app/features/posts/postSlice";

import { toggleLike } from "../app/features/posts/postSlice";

type Props = { post: Post };

export default function PostItem({ post }: Props) {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);

  const isMine = me?.id === post.user_id;

  const onDelete = () => {
    if (!isMine) return;
    if (confirm("Delete this post?")) {
      dispatch(deletePosts(post.id));
    }
  };

  const onLike = () => dispatch(toggleLike(post.id));

  return (
    <div className="border rounded-xl p-4 mb-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.user?.avatar_url ? (
            <img
              src={post.user.avatar_url}
              alt={post.user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-200" />
          )}
          <div>
            <div className="font-semibold">{post.user?.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        {isMine && (
          <button
            onClick={onDelete}
            className="text-sm text-red-600 hover:text-red-700"
            title="Delete post"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-3 whitespace-pre-wrap">{post.content}</div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <button onClick={onLike} className="hover:cursor-pointer">
          {post.liked_by_me ? "❤️" : "🤍"} {post.likes_count ?? 0}
        </button>
        <div>💬 {post.comments_count ?? 0}</div>
      </div>
    </div>
  );
}
