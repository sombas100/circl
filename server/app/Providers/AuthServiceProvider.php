<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\PostLike;
use App\Models\Friendship;
use App\Policies\PostPolicy;
use App\Policies\CommentPolicy;
use App\Policies\PostLikePolicy;
use App\Policies\FriendshipPolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    
    protected $policies = [
        Post::class             => PostPolicy::class,
        Friendship::class       => FriendshipPolicy::class,
        Comment::class          => CommentPolicy::class,
        PostLike::class         => PostLikePolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
