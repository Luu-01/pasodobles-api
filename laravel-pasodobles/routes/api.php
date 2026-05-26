<?php

use App\Http\Controllers\Api\PasodobleController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckAdminRole;
use App\Http\Controllers\Api\FavoritePasodobleController;
use App\Http\Controllers\api\ArchiveChangeRequestController;
use App\Http\Controllers\api\AdminArchiveChangeRequestController;
use App\Http\Controllers\Api\RehearsalController;
use App\Http\Controllers\Api\AdminRehearsalController;


//^ Public routes
Route::get('pasodobles', [PasodobleController::class, 'index']);
Route::get('pasodobles/{pasodoble}', [PasodobleController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('authors', [AuthorController::class, 'index']);
Route::get('authors/{author}', [AuthorController::class, 'show']);



//^ AUTH
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);


// ~--- authenticated API routes ---
Route::middleware('auth:sanctum')->group(function () {
    
    //^ admin features
    Route::middleware([CheckAdminRole::class])->prefix('admin')->group(function () {
        Route::post('pasodobles', [PasodobleController::class, 'store']);
        Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
        Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);

        //? archive-request
        Route::get('archive-requests', [AdminArchiveChangeRequestController::class, 'index']);
        Route::get('archive-requests/{archiveChangeRequest}', [AdminArchiveChangeRequestController::class, 'show']);
        Route::post('archive-requests/{archiveChangeRequest}/approve', [AdminArchiveChangeRequestController::class, 'approve']);
        Route::post('archive-requests/{archiveChangeRequest}/reject', [AdminArchiveChangeRequestController::class, 'reject']);

        Route::post('/rehearsals', [AdminRehearsalController::class, 'store']);
        Route::put('/rehearsals/{rehearsal}', [AdminRehearsalController::class, 'update']);
        Route::delete('/rehearsals/{rehearsal}', [AdminRehearsalController::class, 'destroy']);
        Route::get('/rehearsals/{rehearsal}/attendances', [AdminRehearsalController::class, 'attendances']);
    });
    
    //& set as favorite
    Route::get('/user/favorites', [FavoritePasodobleController::class, 'index']);
    Route::post('/pasodobles/{pasodoble}/favorite', [FavoritePasodobleController::class, 'toggle']);

    //? archive-request
    Route::get('archive-requests', [ArchiveChangeRequestController::class, 'index']);
    Route::get('archive-requests/{archiveChangeRequest}', [ArchiveChangeRequestController::class, 'show']);

    Route::post('archive-requests', [ArchiveChangeRequestController::class, 'store']);

    Route::get('/rehearsals', [RehearsalController::class, 'index']);
    Route::get('/rehearsals/{rehearsal}', [RehearsalController::class, 'show']);
    Route::post('/rehearsals/{rehearsal}/attendance', [RehearsalController::class, 'setAttendance']);
    
    //^ Auth
    Route::get('auth/user', [AuthController::class, 'currentUser']);
    Route::post('auth/logout-all', [AuthController::class, 'logoutAllDevices']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

});