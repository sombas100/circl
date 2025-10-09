<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostLikeResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostLike;
use Illuminate\Http\Request;

class PostLikeController extends Controller
{
    public function toggle(Post $post, Request $request)
    {
        $userId = $request->user()->id;

        $existing = PostLike::where('post_id', $post->id)->where('user_id', $userId)->first();

        if ($existing) {
            $this->authorize('delete', $existing);
            $existing->delete();
            return response()->json(['liked' => false]);
        } else {
            $this->authorize('create', PostLike::class);
            $like = PostLike::create(['post_id' => $post->id, 'user_id' => $userId]);
            return (new PostResource($like))->additional(['liked' => true]);
        }
    }

    public function index(Post $post) {
        $likes = PostLike::with('user:id,name,avatar_url')
            ->where('post_id',$post->id)
            ->latest()
            ->paginate(30);
        return PostLikeResource::collection($likes);
    }
}
