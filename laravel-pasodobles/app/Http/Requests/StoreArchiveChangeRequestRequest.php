<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArchiveChangeRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'target_type' => ['required', 'string', Rule::in(['pasodoble', 'author'])],
            'target_id' => ['nullable', 'integer'],
            'action' => ['required', 'string', Rule::in(['create', 'edit', 'delete'])],
            'payload' => ['nullable', 'array'],

            'payload.title' => ['sometimes', 'required', 'string', 'max:255'],
            'payload.description' => ['sometimes', 'nullable', 'string'],
            'payload.year' => ['sometimes', 'nullable', 'integer', 'min:1800', 'max:' . now()->year],
            'payload.pdf_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'payload.author_id' => ['sometimes', 'nullable', 'integer', 'exists:authors,id'],
            'payload.category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],

            'payload.name' => ['sometimes', 'required', 'string', 'max:255'],
            'payload.biography' => ['sometimes', 'nullable', 'string'],
            'payload.birth_year' => ['sometimes', 'nullable', 'integer', 'min:1500', 'max:' . now()->year],
            'payload.image_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
        ];
    }

    // Check the action before validating determinated fields since
    // not every action requires the same present fields
    //? Examples: Delete doesn't require object data in 'payload' ( only user's reason)
    //?           Create doesn't require target_id, but Edit does

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $targetType = $this->input('target_type');
            $action = $this->input('action');
            $targetId = $this->input('target_id');
            $payload = $this->input('payload', []);

            // check missing mandatory fields

            if (in_array($action, ['edit', 'delete'], true) && empty($targetId)) {
                $validator->errors()->add(
                    'target_id',
                    'The target_id field is required for edit and delete requests.'
                );
            }

            if (in_array($action, ['create', 'edit'], true) && empty($payload)) {
                $validator->errors()->add(
                    'payload',
                    'The payload field is required for create and edit requests.'
                );
            }

            // extra validation depending on action

            if ($action === 'create') {
                $this->validateCreatePayload($validator, $targetType, $payload);
            }
            if ($action === 'delete' && !empty($payload)) {
                $userReason = ['reason'];
                $extraFields = array_diff(array_keys($payload), $userReason);
                
                // removing user's reason and check if is still not empty
                if (!empty($extraFields)) {
                    $validator->errors()->add(
                        'payload',
                        'Delete requests can only contain a reason field.'
                    );
                }
            }
        });
    }

    // Check not nullable fields depending on the targetType

    private function validateCreatePayload($validator, ?string $targetType, array $payload): void
    {
        if ($targetType === 'pasodoble') {
            foreach (['title', 'author_id', 'category_id'] as $field) {
                if (!array_key_exists($field, $payload) || $payload[$field] === null || $payload[$field] === '') {
                    $validator->errors()->add(
                        "payload.$field",
                        "The payload.$field field is required when creating a pasodoble."
                    );
                }
            }
        }

        if ($targetType === 'author') {
            if (!array_key_exists('name', $payload) || $payload['name'] === null || $payload['name'] === '') {
                $validator->errors()->add(
                    'payload.name',
                    'The payload.name field is required when creating an author.'
                );
            }
        }
    }
}
