import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/page/signin/signin.component';
import { SignupComponent } from './auth/page/signup/signup.component';
import { HomeComponent } from './page/home/home.component';
import { FourohfourComponent } from './page/fourohfour/fourohfour.component';
import { MeComponent } from './auth/page/me/me.component';
import { ArticleListComponent } from './shopping/page/article-list/article-list.component';
import { StoreComponent } from './shopping/page/store/store.component';
import { StoreAddComponent } from './shopping/page/store-add/store-add.component';
import { StoreResolver } from './shopping/resolver/store-resolver';
import { IsConnectedGuard } from './auth/guard/is-connected.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'me',
        canActivate: [IsConnectedGuard],
        component: MeComponent
      }
    ]
  },
  {
    path: 'stores',
    children: [
      {
        path: '',
        component: StoreComponent,
        data: {
          name: 'listStores'
        }
      },
      {
        path: 'add',
        component: StoreAddComponent,
        data: {
          name: 'addStore'
        }
      },
      {
        path: ':id',
        resolve: {
          store: StoreResolver
        },
        component: ArticleListComponent,
        data: {
          name: 'listArticle'
        }
      }
    ]
  },
  {
    path: '404',
    component: FourohfourComponent
  },
  {
    path: '**',
    component: FourohfourComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
