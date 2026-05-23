<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArchiveChangeRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'target_type' => $this->target_type,
            'target_id' => $this->target_id,
            'action' => $this->action,

            'payload' => $this->payload,

            'status' => $this->status,
            'admin_reason' => $this->admin_reason,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'reviewed_at' => $this->reviewed_at?->toISOString(),

            // prevent early loading errors by using whenLoaded():
            
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),

            'reviewer' => $this->whenLoaded('reviewer', function () {
                return [
                    'id' => $this->reviewer->id,
                    'name' => $this->reviewer->name,
                    'email' => $this->reviewer->email,
                ];
            }),
        ];
    }
}
