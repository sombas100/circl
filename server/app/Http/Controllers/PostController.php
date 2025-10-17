<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Http\Requests\Post\StorePostRequest;


class PostController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $this->authorize('viewAny', Post::class);

        $friendIds = Friendship::query()
            ->where('status','accepted')
            ->where(fn($q)=>$q->where('requester_id',$user->id)->orWhere('addressee_id',$user->id))
            ->get()
            ->flatMap(fn($f)=>[$f->requester_id,$f->addressee_id])
            ->unique()
            ->reject(fn($id)=>$id === $user->id)
            ->values();

        $posts = Post::with('user:id,name,avatar_url')
            ->withCount(['comments', 'likes'])
            ->withExists([
                'likes as liked_by_me' => fn($q) => $q->where('user_id', $user->id)
            ])
            ->whereIn('user_id', $friendIds->push($user->id))
            ->latest()
            ->paginate(20);

        return PostResource::collection($posts);
    }

    public function show(Request $request, Post $post)
    {
        $userId = $request->user()->id;

        $post->load('user:id,name,avatar_url')
         ->loadCount(['comments','likes'])
         ->loadExists(['likes as liked_by_me' => fn($q) => $q->where('user_id',$userId)]);

         return new PostResource($post);
    }

    public function store(StorePostRequest $request) {
        $this->authorize('create', Post::class);
        $post = Post::create([
            'user_id' => $request->user()->id,
            'content' => $request->validated()['content'],
        ]);
        return (new PostResource($post->load('user:id,name,avatar_url')))->response()->setStatusCode(201);
    }

    public function userPosts($userId) {
        $posts = Post::with('user:id,name,avatar_url')
            ->withCount(['comments','likes'])
            ->withExists(['likes as liked_by_me' => fn($q)=>$q->where('user_id', auth()->id)])
            ->where('user_id', $userId)
            ->latest()
            ->paginate(20);
        return PostResource::collection($posts);
    }

    
    public function destroy(Post $post) {
        $this->authorize('delete', $post);
        $post->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
