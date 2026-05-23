import { User } from '../models/user.interface';
import {Injectable, inject} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { PasodobleService } from '../../pasodobles/services/pasodoble.service';
import { FavoritesResponse } from '../../pasodobles/models/pasodoble.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService{
    private authService = inject(AuthService);
    private pasodobleService = inject(PasodobleService);

    getUser(): User{
        return this.authService.getCurrentUser();
    }

    getFavorites(): Observable<FavoritesResponse>{
        return this.pasodobleService.getUserFavorites();
    }

}