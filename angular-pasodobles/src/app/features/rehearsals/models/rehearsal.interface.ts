export type RehearsalAttendanceStatus = 'pending' | 'confirmed' | 'declined';

export type EditableRehearsalAttendanceStatus = Extract<
  RehearsalAttendanceStatus,
  'confirmed' | 'declined'
>;

export interface RehearsalCreator {
  id: number;
  name: string;
}

export interface Rehearsal {
  id: number;
  date: string | null;
  details: string | null;
  created_by: number | null;
  creator?: RehearsalCreator | null;
  confirmed_count: number;
  declined_count: number;
  pending_count: number;
  my_attendance_status: RehearsalAttendanceStatus | null;
}

export interface RehearsalAttendanceUser {
  id: number;
  name: string;
  email: string;
}

export interface RehearsalAttendance {
  id: number;
  rehearsal_id: number;
  user_id: number;
  status: RehearsalAttendanceStatus;
  responded_at: string | null;
  user?: RehearsalAttendanceUser;
}

export interface RehearsalWithAttendances extends Rehearsal {
  attendances: RehearsalAttendance[];
}

export interface RehearsalPayload {
  date: string;
  details: string | null;
}

export interface SetRehearsalAttendancePayload {
  status: EditableRehearsalAttendanceStatus;
}

export interface RehearsalCollectionResponse {
  data: Rehearsal[];
}

export interface RehearsalResponse {
  data: Rehearsal;
}

export interface RehearsalMutationResponse {
  message: string;
  data: Rehearsal;
}

export interface RehearsalAttendancesResponse {
  data: RehearsalWithAttendances;
}

export interface DeleteRehearsalResponse {
  message: string;
}