import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { first } from 'rxjs/operators';
import { StoreService } from '../shopping/service/store.service';
import { ArticleService } from '../shopping/service/article.service';
import { IStore } from '../shopping/interface/store';
import { ICollection } from '../interface/collection';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  // Just for initiate the store/article services
  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private articleService: ArticleService
  ) { }

  load(): Promise<void> {
    return new Promise((resolve: CallableFunction, reject: CallableFunction) => {
      this.authService
        .userSubject
        .pipe(first())
        .toPromise()
        .then(() => {
          return this.storeService
            .storesSubject
            .pipe(first())
            .toPromise();
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject('Unable to initialize this application');
        });
    });
  }
}
