<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArchiveChangeRequestRequest;
use Illuminate\Http\Request;
use App\Models\ArchiveChangeRequest;
use App\Http\Resources\ArchiveChangeRequestResource;

class ArchiveChangeRequestController extends Controller
{
    private const PER_PAGE = 20;

    // limited to only see user's own requests 
    public function index(Request $request)
    {
        $user = $request->user();

        $archiveRequests = ArchiveChangeRequest::query()
            ->where('user_id', $user->id)
            ->with(['user', 'reviewer'])
            ->latest()
            ->paginate(self::PER_PAGE);

        return ArchiveChangeRequestResource::collection($archiveRequests);
    }

    public function show(Request $request, ArchiveChangeRequest $archiveChangeRequest)
    {
        $user = $request->user();

        if ($archiveChangeRequest->user_id == $user->id || $user->role == 'admin') {
            // admin may have access to every request
            return (new ArchiveChangeRequestResource(
                $archiveChangeRequest->fresh()->load(['user', 'reviewer'])
            ));
        }

        return response()->json([
            'message' => 'Archive change request not found.'
        ], 404);
    }

    public function store(StoreArchiveChangeRequestRequest $request)
    {
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
