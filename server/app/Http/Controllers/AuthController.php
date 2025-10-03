<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'avatar_url'    => $data['avatar_url'] ?? null,
            'password'      => Hash::make($data['password']),
        ]);
        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user'      => new UserResource($user),
            'token'     => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();
        if (!$user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message'   => 'Invalid credentials'], 422);
        }
        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user'          => new UserResource($user),
            'token'         => $token,
        ]);
    }

    public function me(Request $request) 
    {
        return new UserResource($request->user());
    }

    public function logout()
    {
        request()->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
