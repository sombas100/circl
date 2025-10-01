<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FriendshipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'requester_id'  => $this->requester_id,
            'addressee_id'  => $this->addressee_id,
            'status'        => $this->status,
            'requester'     => new UserResource($this->whenLoaded('requester')),
            'addressee'     => new UserResource($this->whenLoaded('addressee')),
            'created_at'    => $this->created_at,
        ];
    }
}
