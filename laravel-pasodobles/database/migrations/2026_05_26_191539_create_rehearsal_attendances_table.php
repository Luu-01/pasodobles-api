<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rehearsal_attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rehearsal_id')
                ->constrained('rehearsals')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('status', [
                'pending',
                'confirmed',
                'declined',
            ])->default('pending');

            $table->timestamp('responded_at')->nullable();

            $table->timestamps();

            // Prevents the same user from having two responses
            // for the same rehearsal.
            $table->unique(['rehearsal_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rehearsal_attendances');
    }
};
