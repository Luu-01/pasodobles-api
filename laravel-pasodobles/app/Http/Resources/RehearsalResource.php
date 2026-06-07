<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RehearsalResource extends JsonResource
{
    
    public function toArray(Request $request): array
    {
        // force attendance status to not mismatch DB
        $myAttendance = $this->whenLoaded('attendances', function () {
            return $this->attendances->first();
        });

        return [
            'id' => $this->id,
            'date' => $this->date?->format('Y-m-d'),
            'details' => $this->details,
            'created_by' => $this->created_by,
            'creator' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator?->id,
                    'name' => $this->creator?->name,
                ];
            }),
            'confirmed_count' => $this->confirmed_count ?? 0,
            'declined_count' => $this->declined_count ?? 0,
            'pending_count' => $this->pending_count ?? 0,
            'my_attendance_status' => $myAttendance?->status,
        ];
    }
}