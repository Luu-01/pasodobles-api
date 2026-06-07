<?php

namespace App\Notifications;

use App\Models\Rehearsal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RehearsalReminderNotification extends Notification
{
    use Queueable;

    public function __construct(
        private Rehearsal $rehearsal
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Recordatorio de ensayo confirmado')
            ->greeting('Hola, ' . $notifiable->name)
            ->line('Te recordamos que mañana tienes un ensayo al que has confirmado asistencia.')
            ->line('Fecha: ' . $this->rehearsal->date?->format('d/m/Y'))
            ->when($this->rehearsal->details, function (MailMessage $message) {
                return $message->line('Detalles: ' . $this->rehearsal->details);
            })
            ->action('Ver ensayos', url('/rehearsals'))
            ->line('Este aviso se envía únicamente a usuarios con asistencia confirmada.');
    }
}
