<?php

namespace App\Providers;

use App\Models\ArchiveChangeRequest;
use App\Observers\ArchiveChangeRequestObserver;
use App\Notifications\WelcomeUserNotification;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
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

        // The welcome email is delayed until email ownership is proven.
        // This avoids sending the welcome notification to unverified addresses.
        Event::listen(Verified::class, function (Verified $event): void {
            $event->user->notify(new WelcomeUserNotification());
        });
    }
}
