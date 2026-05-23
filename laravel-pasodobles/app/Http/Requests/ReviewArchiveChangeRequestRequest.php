<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewArchiveChangeRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        // extra safety layer
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'admin_reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
