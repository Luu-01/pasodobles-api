<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewArchiveChangeRequestRequest;
use App\Http\Resources\ArchiveChangeRequestResource;
use App\Models\ArchiveChangeRequest;
use App\Models\Author;
use App\Models\Pasodoble;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class AdminArchiveChangeRequestController extends Controller
{
    // admin is able to check every request existing
    public function index()
    {
        $requests = ArchiveChangeRequest::with(['user', 'reviewer'])
            ->latest()
            ->get();

        return ArchiveChangeRequestResource::collection($requests);
    }

    public function show(ArchiveChangeRequest $archiveChangeRequest)
    {
        return new ArchiveChangeRequestResource(
            $archiveChangeRequest->fresh()->load(['user', 'reviewer'])
        );
    }

    //^ 'status changing methods use DB::transaction to isolate all the validation
    //  and allow full rollback in case that validation fails
    public function approve(
        ReviewArchiveChangeRequestRequest $request,
        ArchiveChangeRequest $archiveChangeRequest
    ) {
        if ($archiveChangeRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Esta solicitud ya ha sido gestionada.',
            ], 409);
        }

        DB::transaction(function () use ($archiveChangeRequest, $request) {
            $this->applyRequest($archiveChangeRequest);

            $archiveChangeRequest->update([
                'status' => 'approved',
                'reviewed_by' => $request->user()->id,
                'admin_reason' => $request->validated('admin_reason'),
                'reviewed_at' => now(),
            ]);
        });

        return (new ArchiveChangeRequestResource(
            $archiveChangeRequest->fresh()->load(['user', 'reviewer'])
        ))->additional([
            'message' => 'Solicitud aprobada correctamente.',
        ]);
    }

    public function reject(
        ReviewArchiveChangeRequestRequest $request,
        ArchiveChangeRequest $archiveChangeRequest
    ) {
        if ($archiveChangeRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Esta solicitud ya ha sido gestionada.',
            ], 409);
        }

        $archiveChangeRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'admin_reason' => $request->validated('admin_reason'),
            'reviewed_at' => now(),
        ]);

        return (new ArchiveChangeRequestResource(
            $archiveChangeRequest->fresh()->load(['user', 'reviewer'])
        ))->additional([
            'message' => 'Solicitud rechazada correctamente.',
        ]);
    }

    //^ starts a 'match' tree to isolate the requested 'action' in the requested 'targetType'
    private function applyRequest(ArchiveChangeRequest $archiveChangeRequest): void
    {
        match ($archiveChangeRequest->target_type) {
            'pasodoble' => $this->applyPasodobleRequest($archiveChangeRequest),
            'author' => $this->applyAuthorRequest($archiveChangeRequest),
            default => abort(422, 'Invalid target type.'),
        };
    }

    private function applyPasodobleRequest(ArchiveChangeRequest $archiveChangeRequest): void
    {
        $payload = $this->payloadForPersistence($archiveChangeRequest);

        match ($archiveChangeRequest->action) {
            'create' => Pasodoble::create($payload),
            'edit' => Pasodoble::findOrFail($archiveChangeRequest->target_id)
                ->update($payload),
            'delete' => Pasodoble::findOrFail($archiveChangeRequest->target_id)
                ->delete(),
            default => abort(422, 'Invalid pasodoble action.'),
        };
    }

    private function applyAuthorRequest(ArchiveChangeRequest $archiveChangeRequest): void
    {
        $payload = $this->payloadForPersistence($archiveChangeRequest);

        match ($archiveChangeRequest->action) {
            'create' => Author::create($payload),
            'edit' => Author::findOrFail($archiveChangeRequest->target_id)
                ->update($payload),
            'delete' => Author::findOrFail($archiveChangeRequest->target_id)
                ->delete(),
            default => abort(422, 'Invalid author action.'),
        };
    }

    private function payloadForPersistence(ArchiveChangeRequest $archiveChangeRequest): array
    {
        /*
         * The request payload stores all user-submitted data.
         * Some user-submitted keys, like "reason", are useful for the
         * request itself but must not be inserted into pasodobles/authors.
         */
        return Arr::except($archiveChangeRequest->payload ?? [], ['reason']);
    }
}