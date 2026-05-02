<?php

use App\Http\Controllers\Api\PasodobleController;
use Illuminate\Support\Facades\Route;

// Route::post('/login', [ApiAuthController::class, 'login']);

Route::get('pasodobles', [PasodobleController::class, 'index']);
Route::get('pasodobles/{pasodoble}', [PasodobleController::class, 'show']);

// --- Rutas Protegidas de la API ---
Route::middleware('auth:sanctum')->group(function () {
    
    // // Acción de usuario: Votar
    // Route::post('pasodobles/{pasodoble}/votar', [PasodobleController::class, 'votar']);
    
    // Route::post('/logout', [ApiAuthController::class, 'logout']);

    // funciones de admin
    Route::middleware('role:admin')->group(function () {
        Route::post('pasodobles', [PasodobleController::class, 'store']);
        Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
        Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);
    });
});
// temp
Route::post('pasodobles', [PasodobleController::class, 'store']);
Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);