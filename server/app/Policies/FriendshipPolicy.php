<?php

namespace App\Policies;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FriendshipPolicy
{
    
    public function viewAny(User $user): bool 
    { 
        return true; 
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    public function respond(User $user, Friendship $friendship): bool
    {
        return $friendship->addressee_id === $user->id;
    }
}
