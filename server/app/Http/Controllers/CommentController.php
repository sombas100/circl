<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\CommentStoreRequest;
use App\Http\Requests\Comment\CommentUpdateRequest;
use App\Http\Resources\CommentResource;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Post $post)
    {
        $this->authorize('viewAny', Comment::class);

        $comments = Comment::with('user:id,name,avatar_url')
        ->where('post_id', $post->id)->latest()->paginate(20);

        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommentStoreRequest $request)
    {
        $this->authorize('create', Comment::class);
        $data = $request->validated();

        $comment = Comment::create([
            'user_id'        => $request->user()->id,
            'post_id'        => $data['post_id'],
            'content'        => $data['content']
        ])->load('user:id,name,avatar_url');

        return (new CommentResource($comment))->response()->setStatusCode(201);
    }

    

    /**
     * Update the specified resource in storage.
     */
    public function update(CommentUpdateRequest $request, Comment $comment)
    {
        $this->authorize('update', $comment);
        $comment->update($request->validated());
        return new CommentResource($comment->load('user:id,name,avatar_url'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(['message' => 'Comment deleted']);
    }
}
