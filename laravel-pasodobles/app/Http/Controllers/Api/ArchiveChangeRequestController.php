<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArchiveChangeRequestRequest;
use Illuminate\Http\Request;
use App\Models\ArchiveChangeRequest;
use App\Http\Resources\ArchiveChangeRequestResource;

class ArchiveChangeRequestController extends Controller
{

    // limited to only see user's own requests 
    public function index(Request $request){
        $user = $request->user();
        $archiveRequests= ArchiveChangeRequest::where('user_id', $user->id)->latest()->get();

        return ArchiveChangeRequestResource::collection($archiveRequests);
    }

    public function store(StoreArchiveChangeRequestRequest $request){
        $validated = $request->validated();

        $changeRequest = ArchiveChangeRequest::create([
            'user_id' => $request->user()->id,
            'target_type' => $validated['target_type'],
            'target_id' => $validated['target_id'] ?? null,
            'action' => $validated['action'],
            'payload' => $validated['payload'] ?? null, // extra validation in Request
            'status' => 'pending',
        ]);
        // The user's reason is stored inside payload, not in a separate database column.
        // admin_reason is reserved for the administrator's approve/reject feedback.

        return (new ArchiveChangeRequestResource($changeRequest))
            ->additional([
                'message' => 'Solicitud creada correctamente.',
            ])
            ->response()
            ->setStatusCode(201);
    }
}
