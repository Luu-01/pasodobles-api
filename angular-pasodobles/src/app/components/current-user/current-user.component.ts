import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../user.service';
import { User } from '../../user.interface';

@Component({
  selector: 'app-current-user',
  imports: [],
  templateUrl: './current-user.component.html',
  styleUrl: './current-user.css',
})
export class CurrentUserComponent implements OnInit{
  private userService = inject(UserService);
  private cdr= inject(ChangeDetectorRef);

  user?: User;

  ngOnInit(): void {
    const id = window.localStorage.getItem('id');
    
    this.userService.getUser(id).subscribe({
      next: (response) => {
        this.user = response;
        this.cdr.detectChanges();
      }
    });
  }
}
