<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rehearsal extends Model
{
    protected $fillable = [
        'date',
        'details',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(RehearsalAttendance::class);
    }

    public function confirmedAttendances(): HasMany
    {
        return $this->attendances()->where('status', 'confirmed');
    }

    public function declinedAttendances(): HasMany
    {
        return $this->attendances()->where('status', 'declined');
    }

    public function pendingAttendances(): HasMany
    {
        return $this->attendances()->where('status', 'pending');
    }
}
