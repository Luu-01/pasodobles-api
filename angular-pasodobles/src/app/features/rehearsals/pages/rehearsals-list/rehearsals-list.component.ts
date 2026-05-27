import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import {
  EditableRehearsalAttendanceStatus,
  Rehearsal,
  RehearsalAttendanceStatus,
} from '../../models/rehearsal.interface';
import { RehearsalService } from '../../services/rehearsal.service';

interface CalendarDay {
  date: Date;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  rehearsals: Rehearsal[];
}

@Component({
  selector: 'app-rehearsal-list',
  standalone: true,
  templateUrl: './rehearsals-list.component.html',
  styleUrl: './rehearsals-list.component.scss',
})
export class RehearsalsListComponent implements OnInit {
  private readonly rehearsalService = inject(RehearsalService);
  private readonly cdr = inject(ChangeDetectorRef);

  rehearsals: Rehearsal[] = [];
  calendarDays: CalendarDay[] = [];

  currentDate = new Date();
  selectedDate = this.toIsoDate(new Date());

  isLoading = true;
  actionLoadingId: number | null = null;
  errorMessage = '';

  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  ngOnInit(): void {
    this.loadRehearsals();
  }

  loadRehearsals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rehearsalService.getRehearsals().subscribe({
      next: (response) => {
        this.rehearsals = response.data;
        this.buildCalendar();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading rehearsals', error);
        this.errorMessage = 'No se pudieron cargar los ensayos.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

    this.selectedDate = this.toIsoDate(
      new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
    );

    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.selectedDate = this.toIsoDate(
      new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
    );

    this.buildCalendar();
  }

  goToToday(): void {
    const today = new Date();

    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedDate = this.toIsoDate(today);

    this.buildCalendar();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate = day.isoDate;
    this.calendarDays = this.calendarDays.map((calendarDay) => ({
      ...calendarDay,
      isSelected: calendarDay.isoDate === this.selectedDate,
    }));
  }

  setAttendance(rehearsal: Rehearsal, status: EditableRehearsalAttendanceStatus): void {
    this.actionLoadingId = rehearsal.id;
    this.errorMessage = '';

    this.rehearsalService.setAttendance(rehearsal.id, { status }).subscribe({
      next: (response) => {
        this.rehearsals = this.rehearsals.map((item) =>
          item.id === rehearsal.id ? response.data : item
        );

        this.buildCalendar();
        this.actionLoadingId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error setting attendance', error);
        this.errorMessage = 'No se pudo actualizar la asistencia.';
        this.actionLoadingId = null;
        this.cdr.markForCheck();
      },
    });
  }

  get selectedDayRehearsals(): Rehearsal[] {
    return this.rehearsals
      .filter((rehearsal) => rehearsal.date === this.selectedDate)
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric',
    }).format(this.currentDate);
  }

  getStatusLabel(status: RehearsalAttendanceStatus | null): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'declined':
        return 'Rechazado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Sin respuesta';
    }
  }

  getStatusClass(status: RehearsalAttendanceStatus | null): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'declined':
        return 'status-declined';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-empty';
    }
  }

  isActionLoading(rehearsalId: number): boolean {
    return this.actionLoadingId === rehearsalId;
  }

  private buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstMonthDay = new Date(year, month, 1);
    const firstGridDay = this.getMondayBasedGridStart(firstMonthDay);

    const todayIso = this.toIsoDate(new Date());

    this.calendarDays = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDay);
      date.setDate(firstGridDay.getDate() + index);

      const isoDate = this.toIsoDate(date);

      return {
        date,
        isoDate,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: isoDate === todayIso,
        isSelected: isoDate === this.selectedDate,
        rehearsals: this.rehearsals.filter((rehearsal) => rehearsal.date === isoDate),
      };
    });
  }

  private getMondayBasedGridStart(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const mondayBasedOffset = day === 0 ? 6 : day - 1;

    start.setDate(start.getDate() - mondayBasedOffset);

    return start;
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}