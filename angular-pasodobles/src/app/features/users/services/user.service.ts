import { User } from '../models/user.interface';
import {Injectable, inject} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { Pasodoble } from '../../pasodobles/models/pasodoble.interface';
import { PasodobleService } from '../../pasodobles/services/pasodoble.service';

@Injectable({
    providedIn: 'root'
})
export class UserService{
    private authService = inject(AuthService);
    private pasodobleService = inject(PasodobleService);

    getUser(): Observable<User> {
        return this.authService.getUser();
    }

    getFavorites(): Observable<any>{
        return this.pasodobleService.getUserFavorites();
    }

}