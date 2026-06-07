<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archive_change_requests', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('target_type'); 
            $table->unsignedBigInteger('target_id')->nullable();

            $table->string('action');

            $table->json('payload')->nullable();

            $table->string('status')->default('pending');

            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->text('admin_reason')->nullable();

            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archive_change_requests');
    }
};
