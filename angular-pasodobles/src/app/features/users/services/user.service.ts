import { User } from '../models/user.interface';
import {Injectable, inject} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService{
    private authService = inject(AuthService);

    private apiUrl = 'http://pasodobles.mb/api/auth/user'; 

    getUser(id: string | null): Observable<User> {
        return this.authService.getUser();
    }

}