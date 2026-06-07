<?php

namespace App\Observers;

use App\Models\ArchiveChangeRequest;
use App\Notifications\ArchiveChangeRequestStatusNotification;
use Throwable;

class ArchiveChangeRequestObserver
{
    public function updated(ArchiveChangeRequest $archiveChangeRequest): void
    {
        if (! $archiveChangeRequest->wasChanged('status')) {
            return;
        }

        if (! in_array($archiveChangeRequest->status, ['approved', 'rejected'], true)) {
            return;
        }

        $archiveChangeRequest->loadMissing('user');

        try {
            $archiveChangeRequest->user?->notify(
                new ArchiveChangeRequestStatusNotification($archiveChangeRequest)
            );
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
