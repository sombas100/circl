<?php

namespace App\Http\Controllers;

use App\Http\Requests\Friendship\FriendshipRespondRequest;
use App\Http\Requests\Friendship\FriendshipSendRequest;
use App\Http\Resources\FriendshipResource;
use App\Http\Resources\UserResource;
use App\Models\Friendship;
use Illuminate\Http\Request;

class FriendshipController extends Controller {
    public function friends(Request $request) {
        $this->authorize('viewAny', Friendship::class);
        $me = $request->user()->id;

        $friendships = Friendship::with(['requester:id,name,avatar_url','addressee:id,name,avatar_url'])
            ->where('status','accepted')
            ->where(fn($q)=>$q->where('requester_id',$me)->orWhere('addressee_id',$me))
            ->get();

        $friends = $friendships->map(fn($f) => $f->requester_id === $me ? $f->addressee : $f->requester);

        return UserResource::collection($friends);
    }

    public function pending(Request $request) {
        $this->authorize('viewAny', Friendship::class);
        $me = $request->user()->id;

        $pending = Friendship::with('requester:id,name,avatar_url')
            ->where('status','pending')
            ->where('addressee_id', $me)
            ->get();

        return FriendshipResource::collection($pending);
    }

    public function send(FriendshipSendRequest $request) {
        $this->authorize('create', Friendship::class);
        $me = $request->user()->id;
        $addresseeId = (int) $request->validated()['addressee_id'];

        if ($addresseeId === $me) {
            return response()->json(['message' => 'Cannot friend yourself'], 422);
        }

        $exists = Friendship::where(function($q) use ($me, $addresseeId){
            $q->where('requester_id',$me)->where('addressee_id',$addresseeId);
        })->orWhere(function($q) use ($me, $addresseeId){
            $q->where('requester_id',$addresseeId)->where('addressee_id',$me);
        })->exists();

        if ($exists) return response()->json(['message' => 'Request already exists'], 422);

        $fr = Friendship::create([
            'requester_id' => $me,
            'addressee_id' => $addresseeId,
            'status' => 'pending'
        ]);

        return (new FriendshipResource($fr))->response()->setStatusCode(201);
    }

    public function respond(FriendshipRespondRequest $request, Friendship $friendship) {
        $this->authorize('respond', $friendship);

        $action = $request->validated()['action'];
        $friendship->status = $action === 'accept' ? 'accepted' : 'declined';
        $friendship->save();

        return new FriendshipResource($friendship);
    }
}
