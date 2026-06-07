<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Pasodoble;
use App\Models\Rehearsal;
use App\Models\RehearsalAttendance;

class User extends Authenticatable implements MustVerifyEmail
{

    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function favoritePasodobles()
    {
        return $this->belongsToMany(
            Pasodoble::class,
            'pasodoble_user_favorites'
        )->withTimestamps();
    }

    public function archiveChangeRequests()
    {
        return $this->hasMany(ArchiveChangeRequest::class);
    }

    public function reviewedArchiveChangeRequests()
    {
        return $this->hasMany(ArchiveChangeRequest::class, 'reviewed_by');
    }

    public function createdRehearsals()
    {
        return $this->hasMany(Rehearsal::class, 'created_by');
    }

    public function rehearsalAttendances()
    {
        return $this->hasMany(RehearsalAttendance::class);
    }
}
