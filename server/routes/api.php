<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/feed', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/users/{id}/posts', [PostController::class, 'userPosts']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::get('/friends', [FriendshipController::class, 'friends']);
    Route::get('/friend-requests', [FriendshipController::class, 'pending']);
    Route::post('friend-requests', [FriendshipController::class, 'send']);
    Route::post('friend-requests/{friendship}/respond', [FriendshipController::class, 'respond']);

    Route::get('/users/search', [UserController::class, 'search']);
});
