import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from 'src/app/shopping/service/store.service';
import { IStore } from 'src/app/shopping/interface/store';
import { ICollection } from 'src/app/interface/collection';
import { AuthService } from 'src/app/auth/service/auth.service';
import { IUser } from 'src/app/auth/interface/user';
import { Subscription } from 'rxjs';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/toast/service/toast.service';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {
  public stores: ICollection<IStore>[] = [];
  private storesSubscription: Subscription;
  public user: IUser;
  private userSubscription: Subscription;
  public faPlus = faPlus;
  public faPen = faPen;
  public displayModal = false;

  constructor(
    private storesService: StoreService,
    private authService: AuthService,
    private toastService: ToastService,
    private headService: HeadService
  ) { }

  public ngOnInit(): void {
    this.headService.setTitle('Mes Magasins');
    this.storesSubscription = this.storesService.storesSubject.subscribe((stores: ICollection<IStore>[]) => {
      this.stores = stores;
    });
    this.storesService.emitStores();
    this.userSubscription = this.authService.userSubject.subscribe((user: IUser) => {
      this.user = user;
    });
    this.authService.emitUser();
  }

  public ngOnDestroy(): void {
    this.storesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  public onDelete(storeReference: string): void {
    const title = 'Suppression';
    this.storesService.delete(storeReference).then(() => {
      this.toastService.addToast(title, 'Votre magasin à bien été supprimé.');
    }).catch(() => {
      this.toastService.addToast(title, 'Impossible de supprimer votre magasin. Effectuez une nouvelle tentative. Si le problème persiste, merci de contacter un administrateur afin qu\'il puisse vous aider.');
    });
  }

  public toogleModalModify(storeC: ICollection<IStore>): void {
    alert('toogle');
  }

}
