<?php
namespace App\Http\Controllers;

use App\Http\Requests\User\UserSearchRequest;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller {
    public function search(UserSearchRequest $request) {
        $q = $request->q();
        if ($q === '') return response()->json([]);

        $users = User::query()
            ->where(fn($query)=>$query->where('name','like',"%$q%")->orWhere('email','like',"%$q%"))
            ->limit(20)
            ->get(['id','name','email','avatar_url']);

        return UserResource::collection($users);
    }
}
