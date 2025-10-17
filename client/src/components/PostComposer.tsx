import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createNewPost } from "../app/features/posts/postSlice";

export default function PostComposer() {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.post.loading);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    await dispatch(createNewPost(content));
    setText("");
  };

  return (
    <form onSubmit={onSubmit} className="border rounded-xl p-4 mb-4 bg-white">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
        className="w-full border rounded-lg p-3 min-h-[80px] focus:outline-none"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={loading || !text.trim()}
        >
          Post
        </button>
      </div>
    </form>
  );
}
