import { Component, OnInit, OnDestroy } from '@angular/core';
import { faHome, faTimes, faBars, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/service/auth.service';
import { IUser } from 'src/app/auth/interface/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ArticleService } from 'src/app/shopping/service/article.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public show = false;
  public faHome = faHome;
  public faTimes = faTimes;
  public faBars = faBars;
  public faPowerOff = faPowerOff;
  public user: IUser;
  private userSubscription: Subscription;
  public isDev = !environment.production;

  constructor(
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe((user: IUser) => {
      this.user = user;
    });
    this.authService.emitUser();
  }

  toogleMenu(): void {
    this.show = !this.show;
  }

  toogleMobileMenu(): void {
    if (this.show) {
      this.toogleMenu();
    }
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.articleService.initFireObservation([]);
    }).then(() => {
      const uri = this.router.url;
      switch (uri) {
        // Cas url fixes
        case '/auth/me':
        case '/stores':
          this.router.navigate(['auth/signin']);
          break;
        // Cas url dynamique
        default:
          if (uri.match(/^\/stores\/[a-zA-Z0-9]+$/)) {
            this.router.navigate(['stores/']);
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  test() {
    console.log(this.router.routerState.snapshot);
  }

}
