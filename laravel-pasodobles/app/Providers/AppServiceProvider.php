<?php

namespace App\Providers;

use App\Models\ArchiveChangeRequest;
use App\Observers\ArchiveChangeRequestObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ArchiveChangeRequest::observe(ArchiveChangeRequestObserver::class);
    }
}