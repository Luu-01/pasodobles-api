<?php

use App\Http\Controllers\Api\PasodobleController;
use App\Http\Controllers\Api\AuthorController;
use Illuminate\Support\Facades\Route;


Route::get('pasodobles', [PasodobleController::class, 'index']);
Route::get('pasodobles/{pasodoble}', [PasodobleController::class, 'show']);
Route::get('authors', [AuthorController::class, 'index']);
Route::get('authors/{author}', [AuthorController::class, 'show']);


// --- protected API routes ---
Route::middleware('auth:sanctum')->group(function () {
    
    // admin features
    Route::middleware('role:admin')->group(function () {
        Route::post('pasodobles', [PasodobleController::class, 'store']);
        Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
        Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);
    });
});
// temp, just for testing
Route::post('pasodobles', [PasodobleController::class, 'store']);
Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);