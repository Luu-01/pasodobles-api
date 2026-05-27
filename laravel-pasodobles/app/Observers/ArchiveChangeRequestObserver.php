<?php

namespace App\Observers;

use App\Models\ArchiveChangeRequest;
use App\Notifications\ArchiveChangeRequestStatusNotification;

class ArchiveChangeRequestObserver
{
    public function updated(ArchiveChangeRequest $archiveChangeRequest): void
    {
        if (!$archiveChangeRequest->wasChanged('status')) {
            return;
        }

        if (!in_array($archiveChangeRequest->status, ['approved', 'rejected'], true)) {
            return;
        }

        $archiveChangeRequest->loadMissing('user');
        $archiveChangeRequest->user?->notify(
            new ArchiveChangeRequestStatusNotification($archiveChangeRequest)
        );
    }
}
