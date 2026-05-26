<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRehearsalRequest;
use App\Http\Requests\UpdateRehearsalRequest;
use App\Models\Rehearsal;
use Illuminate\Http\JsonResponse;

class AdminRehearsalController extends Controller
{

    // not returning RehearsalResource since some fields aren't required
    public function store(StoreRehearsalRequest $request)
    {
        $rehearsal = Rehearsal::create([
            'date' => $request->validated('date'),
            'details' => $request->validated('details'),
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Rehearsal created successfully.',
            'data' => $rehearsal,
        ], 201);
    }

    public function update(
        UpdateRehearsalRequest $request,
        Rehearsal $rehearsal
    ): JsonResponse {
        $rehearsal->update([$request]);

        return response()->json([
            'message' => 'Rehearsal updated successfully.',
            'data' => $rehearsal,
        ]);
    }

    public function destroy(Rehearsal $rehearsal)
    {
        $rehearsal->delete();

        return response()->json([
            'message' => 'Rehearsal deleted successfully.',
        ]);
    }

    public function attendances(Rehearsal $rehearsal)
    {
        $rehearsal->load([
            'attendances.user:id,name,email',
        ]);

        return response()->json([
            'data' => $rehearsal,
        ]);
    }
}