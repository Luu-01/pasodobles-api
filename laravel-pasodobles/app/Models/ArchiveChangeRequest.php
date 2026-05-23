<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchiveChangeRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'target_type',
        'target_id',
        'action',
        'payload',
        'status',
        'reviewed_by',
        'admin_reason',
        'reviewed_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
