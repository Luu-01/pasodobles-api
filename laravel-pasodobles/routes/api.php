<?php

use App\Http\Controllers\Api\PasodobleController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExternalPasodobleSearchController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckAdminRole;
use App\Http\Controllers\Api\FavoritePasodobleController;
use App\Http\Controllers\Api\ArchiveChangeRequestController;
use App\Http\Controllers\Api\AdminArchiveChangeRequestController;
use App\Http\Controllers\Api\RehearsalController;
use App\Http\Controllers\Api\AdminRehearsalController;


//^ Public routes
Route::get('pasodobles', [PasodobleController::class, 'index']);
Route::get('pasodobles/{pasodoble}', [PasodobleController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('authors', [AuthorController::class, 'index']);
Route::get('authors/{author}', [AuthorController::class, 'show']);
Route::get('external/pasodobles/search', ExternalPasodobleSearchController::class)
    ->middleware('throttle:30,1');



//^ AUTH
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');


// ~--- authenticated API routes ---
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    //^ admin features
    Route::middleware([CheckAdminRole::class])->prefix('admin')->group(function () {
        Route::post('pasodobles', [PasodobleController::class, 'store']);
        Route::put('pasodobles/{pasodoble}', [PasodobleController::class, 'update']);
        Route::delete('pasodobles/{pasodoble}', [PasodobleController::class, 'destroy']);

        Route::post('authors', [AuthorController::class, 'store']);
        Route::put('authors/{author}', [AuthorController::class, 'update']);
        Route::delete('authors/{author}', [AuthorController::class, 'destroy']);

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
