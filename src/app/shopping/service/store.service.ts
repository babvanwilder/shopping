import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { IStore } from 'src/app/shopping/interface/store';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { IUser } from 'src/app/auth/interface/user';
import { map } from 'rxjs/operators';
import { ICollection } from 'src/app/interface/collection';
import { ArticleService } from './article.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private fireStoreCollectionStoresSubscription: Subscription;
  private storesC: ICollection<IStore>[];
  public storesSubject: Subject<ICollection<IStore>[]>;
  private user: IUser;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private articleService: ArticleService
  ) {
    this.storesC = [];
    this.storesSubject = new Subject<ICollection<IStore>[]>();

    // On s'inscrit à la mise à jour du user
    this.authService.userSubject.subscribe((user: IUser) => {
      const updateFireObservation = this.user !== user;
      this.user = user;
      if (updateFireObservation) {
        this.initFireObservation();
      }
    });
    this.authService.emitUser();
  }

  public emitStores(): void
  {
    this.storesSubject.next(this.storesC);
  }

  private initFireObservation(): void {
    if (this.fireStoreCollectionStoresSubscription !== undefined) {
      this.fireStoreCollectionStoresSubscription.unsubscribe();
    }
    this.fireStoreCollectionStoresSubscription = this.fireStore
      .collection<IStore>(this.getCollectionPath())
      .snapshotChanges()
      .pipe<ICollection<IStore>[]>(map((actions: DocumentChangeAction<IStore>[]) => {
        return actions.map((event: DocumentChangeAction<IStore>) => {
          return {
            key: event.payload.doc.id,
            data: event.payload.doc.data()
          };
        });
      })).subscribe((storesC: ICollection<IStore>[]) => {
        // Si on recoi une collection de stores undefined, on initialise un array pour que le sort ne plante pas
        if (storesC === undefined) {
          storesC = [];
        }
        this.storesC = storesC.sort((firstStoreC: ICollection<IStore>, secondStoreC: ICollection<IStore>) => {
          const firstName = firstStoreC.data.name.toLowerCase();
          const secondName = secondStoreC.data.name.toLowerCase();
          return firstName < secondName ? -1 : (firstName > secondName ? 1 : 0);
        });
        this.emitStores();
        const storesReferences = this.storesC.map((storeC: ICollection<IStore>) => {
          return storeC.key;
        });
        this.articleService.initFireObservation(storesReferences);
      });
  }

  private getCollectionPath(): string {
    return 'users/{userUid}/stores'
      .replace('{userUid}', !!this.user ? this.user.uid : 'public');
  }

  public async add(store: IStore): Promise<string> {
    const storeDocument = await this.fireStore.collection(this.getCollectionPath()).add(store);
    await this.articleService.add(storeDocument.id, {
      name: 'Article d\'exemple',
      quantity: 1,
      buy: false,
      photoUrl: null,
      mask: false
    });
    return storeDocument.id;
  }

  /**
   * TODO: Use firestore function to delete all articles in the store before deleted
   */
  public delete(storeReference: string): Promise<void> {
    return this.fireStore.collection(this.getCollectionPath()).doc(storeReference).delete();
  }

  public get(storeReference: string): ICollection<IStore> {
    const storesC = this.storesC.filter((store: ICollection<IStore>) => {
      return store.key === storeReference;
    });
    return storesC[0] !== undefined ? storesC[0] : null;
  }
}
