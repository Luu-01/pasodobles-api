<?php

use App\Http\Controllers\Api\PasodobleController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckAdminRole;

//^ Public routes
Route::get('pasodobles', [PasodobleController::class, 'index']);
Route::get('pasodobles/{pasodoble}', [PasodobleController::class, 'show']);
Route::get('authors', [AuthorController::class, 'index']);
Route::get('authors/{author}', [AuthorController::class, 'show']);

//^ AUTH
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);

// --- protected API routes ---
Route::middleware('auth:sanctum')->group(function () {
    
    // admin features
    Route::middleware([CheckAdminRole::class])->prefix('admin')->group(function () {
        Route::post('pasodobles', [PasodobleController::class, 'store']);
        Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
        Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);
    });

    Route::get('auth/user', [AuthController::class, 'currentUser']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
});