import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../app/features/posts/postSlice";
import PostItem from "./PostItem";
import PostComposer from "./PostComposer";

export default function PostList() {
  const dispatch = useAppDispatch();
  const { feed, loading, error } = useAppSelector((s) => s.post);
  const [page, setPage] = useState(1);

  // If your fetchPosts replaces the page (not append), keep page=1; otherwise you can implement append behavior in reducer.
  useEffect(() => {
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

  const posts = useMemo(() => feed?.data ?? [], [feed]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostComposer />

      {loading && !posts.length && (
        <div className="space-y-3">
          <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />
          <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />
        </div>
      )}

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      {!loading && posts.length === 0 && (
        <div className="text-gray-500 text-center py-8">No posts yet.</div>
      )}

      {posts.map((p) => (
        <PostItem key={p.id} post={p} />
      ))}

      {/* Simple pager (replace with infinite scroll later if you want) */}
      {feed && feed.current_page < feed.last_page && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
