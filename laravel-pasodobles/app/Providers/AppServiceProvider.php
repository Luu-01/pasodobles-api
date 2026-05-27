<?php

namespace App\Providers;

use App\Models\ArchiveChangeRequest;
use App\Observers\ArchiveChangeRequestObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // The observer keeps the archive-request email automation coupled to the
        // model state transition instead of to a specific controller method.
        ArchiveChangeRequest::observe(ArchiveChangeRequestObserver::class);
    }
}
