<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetRehearsalAttendanceRequest;
use App\Models\Rehearsal;
use App\Models\RehearsalAttendance;
use Illuminate\Http\Request;
use App\Http\Resources\RehearsalResource;

class RehearsalController extends Controller
{
    private const PER_PAGE = 20;

    public function index(Request $request) 
    {
        $userId = $request->user()->id;

        $rehearsals = Rehearsal::query()
            ->with('creator:id,name')
            ->withCount([
                'confirmedAttendances as confirmed_count',
                'declinedAttendances as declined_count',
                'pendingAttendances as pending_count',
            ])
            ->with([
                'attendances' => function ($query) use ($userId) {
                    $query
                        ->where('user_id', $userId)
                        ->select('id', 'rehearsal_id', 'user_id', 'status');
                },
            ])
            ->orderBy('date')
            ->paginate(self::PER_PAGE);

        return RehearsalResource::collection($rehearsals);
    }

    public function show(Rehearsal $rehearsal, Request $request)
    {
        $userId = $request->user()->id;

        $rehearsal->load([
            'creator:id,name',
            'attendances' => function ($query) use ($userId) {
                $query
                    ->where('user_id', $userId)
                    ->select('id', 'rehearsal_id', 'user_id', 'status');
            },
        ]);

        $rehearsal->loadCount([
            'confirmedAttendances as confirmed_count',
            'declinedAttendances as declined_count',
            'pendingAttendances as pending_count',
        ]);

        return new RehearsalResource($rehearsal);
    }

    public function setAttendance(SetRehearsalAttendanceRequest $request, Rehearsal $rehearsal)
    {
        RehearsalAttendance::updateOrCreate(
            [
                'rehearsal_id' => $rehearsal->id,
                'user_id' => $request->user()->id,
            ],
            [
                'status' => $request->validated('status'),
                'responded_at' => now(),
            ]
        );

        $rehearsal->load([
            'creator:id,name',
            'attendances' => function ($query) use ($request) {
                $query
                    ->where('user_id', $request->user()->id)
                    ->select('id', 'rehearsal_id', 'user_id', 'status', 'responded_at');
            },
        ]);

        $rehearsal->loadCount([
            'confirmedAttendances as confirmed_count',
            'declinedAttendances as declined_count',
            'pendingAttendances as pending_count',
        ]);

        return response()->json([
            'message' => 'Attendance updated successfully.',
            'data' => new RehearsalResource($rehearsal),
        ]);
    }
}
