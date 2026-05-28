<?php

namespace App\Console\Commands;

use App\Models\Rehearsal;
use App\Notifications\RehearsalReminderNotification;
use Illuminate\Console\Command;
use Throwable;

class SendRehearsalReminderEmails extends Command
{
    protected $signature = 'rehearsals:send-reminders';

    protected $description = 'Send reminder emails for tomorrow rehearsals to confirmed users.';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        Rehearsal::query()
            ->whereDate('date', $tomorrow)
            ->with(['attendances' => function ($query) {
                $query
                    ->where('status', 'confirmed')
                    ->with('user');
            }])
            ->get()
            ->each(function (Rehearsal $rehearsal) {
                $rehearsal->attendances->each(function ($attendance) use ($rehearsal) {
                    try {
                        $attendance->user?->notify(
                            new RehearsalReminderNotification($rehearsal)
                        );
                    } catch (Throwable $exception) {
                        report($exception);
                    }
                });
            });

        $this->info('Rehearsal reminder emails processed.');

        return self::SUCCESS;
    }
}