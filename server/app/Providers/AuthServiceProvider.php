<?php

namespace App\Providers;

use App\Models\Friendship;
use App\Models\Post;
use App\Policies\FriendshipPolicy;
use App\Policies\PostPolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    
    protected $policies = [
        Post::class             => PostPolicy::class,
        Friendship::class       => FriendshipPolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
