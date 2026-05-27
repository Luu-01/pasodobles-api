<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeUserNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bienvenido/a a Pasodobles')
            ->greeting('Hola, ' . $notifiable->name)
            ->line('Tu cuenta se ha creado correctamente en la plataforma Pasodobles.')
            ->line('Desde ahora puedes consultar el archivo musical, guardar favoritos, confirmar asistencia a ensayos y enviar solicitudes de cambio.')
            ->action('Acceder a la plataforma', url('/'))
            ->line('Gracias por registrarte.');
    }
}
