import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ToastComponent } from './toast/component/toast/toast.component';
import { SigninComponent } from './auth/page/signin/signin.component';
import { SignupComponent } from './auth/page/signup/signup.component';
import { MeComponent } from './auth/page/me/me.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './page/home/home.component';
import { FourohfourComponent } from './page/fourohfour/fourohfour.component';
import { StoreComponent } from './shopping/page/store/store.component';
import { ArticleListComponent } from './shopping/page/article-list/article-list.component';
import { StoreAddComponent } from './shopping/page/store-add/store-add.component';

import { ToastService } from './toast/service/toast.service';
import { AuthService } from './auth/service/auth.service';
import { StoreService } from './shopping/service/store.service';
import { ArticleService } from './shopping/service/article.service';
import { StartupService } from './service/startup.service';
import { HeadService } from './service/head.service';

import { StoreResolver } from './shopping/resolver/store-resolver';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    ToastComponent,
    FourohfourComponent,
    MeComponent,
    StoreComponent,
    ArticleListComponent,
    StoreAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    StartupService,
    ToastService,
    AuthService,
    StoreService,
    ArticleService,
    HeadService,
    StoreResolver,
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => {
        return () => startupService.load();
      },
      deps: [
        StartupService
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
