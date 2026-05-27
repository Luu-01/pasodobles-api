<?php

namespace App\Notifications;

use App\Models\ArchiveChangeRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArchiveChangeRequestStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        private ArchiveChangeRequest $archiveChangeRequest
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isApproved = $this->archiveChangeRequest->status === 'approved';

        $message = (new MailMessage)
            ->subject($isApproved ? 'Solicitud de archivo aceptada' : 'Solicitud de archivo denegada')
            ->greeting('Hola, ' . $notifiable->name)
            ->line($isApproved
                ? 'Tu solicitud de cambio en el archivo musical ha sido aceptada.'
                : 'Tu solicitud de cambio en el archivo musical ha sido denegada.'
            )
            ->line('Tipo de solicitud: ' . $this->archiveChangeRequest->action)
            ->line('Elemento afectado: ' . $this->archiveChangeRequest->target_type);

        if ($this->archiveChangeRequest->admin_reason) {
            $message->line('Comentario del administrador: ' . $this->archiveChangeRequest->admin_reason);
        }

        return $message
            ->action('Ver mis solicitudes', url('/archive-requests'))
            ->line('Este aviso se ha enviado automáticamente al resolverse tu solicitud.');
    }
}
