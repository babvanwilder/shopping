import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/service/auth.service';
import { IUser } from './auth/interface/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: IUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void{
    this.authService
      .userSubject
      .subscribe((user: IUser) => {
        this.user = user;
      });
    this.authService.emitUser();
  }
}
