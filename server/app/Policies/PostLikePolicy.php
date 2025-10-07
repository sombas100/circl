<?php

namespace App\Policies;

use App\Models\PostLike;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostLikePolicy
{
    
    public function create(User $user): bool
    {
        return true;
    }


    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PostLike $like): bool
    {
        return $like->user_id === $user->id;
    }

    
}
