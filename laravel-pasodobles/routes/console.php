<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('sanctum:prune-expired --hours=24')->daily(); // dead tokens cleanup

// Sends rehearsal reminders once per day. The command itself filters only
// tomorrow rehearsals and only users with confirmed attendance.
Schedule::command('rehearsals:send-reminders')->dailyAt('09:00');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
