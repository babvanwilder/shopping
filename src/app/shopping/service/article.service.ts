import { Injectable } from '@angular/core';
import { IArticle } from 'src/app/shopping/interface/article';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, Subject } from 'rxjs';
import { ICollection } from 'src/app/interface/collection';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/auth/interface/user';
import { AuthService } from 'src/app/auth/service/auth.service';
import { IStore } from '../interface/store';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private user: IUser;
  private articles: {
    subject: Subject<ICollection<IArticle>[]>,
    fireStoreSubscription: Subscription,
    articlesC: ICollection<IArticle>[]
  }[];

  constructor(
    private authService: AuthService,
    private fireStore: AngularFirestore
  ) {
    this.authService.userSubject.subscribe((user: IUser) => {
      this.user = user;
    });
    this.authService.emitUser();
    this.articles = [];
  }

  private getCollectionPath(storeReference: string): string {
    return 'users/{userUid}/stores/{storeReference}/articles'
      .replace('{userUid}', !!this.user ? this.user.uid : 'public')
      .replace('{storeReference}', storeReference);
  }

  public initFireObservation(storesReferences: string[]): void
  {
    // En premier on supprimes les ecouteurs en trop (qui ne sont pas dans storesReferences)
    for (const storeReference in this.articles) {
      if (storesReferences.indexOf(storeReference) === -1) {
        this.articles[storeReference].fireStoreSubscription.unsubscribe();
        this.articles[storeReference].articlesC = undefined;
        this.emitArticles(storeReference);
        delete this.articles[storeReference];
      }
    }
    // Ensuite on boucle sur chaque storesReferences et si il n'est pas encore init on le creer
    storesReferences.forEach((storeReference: string) => {
      if (this.articles[storeReference] === undefined) {
        this.articles[storeReference] = {
          subject: new Subject<ICollection<IArticle>>(),
          articlesC: [],
          fireStoreSubscription: this.getFireStoreSubject(storeReference).subscribe((articlesC: ICollection<IArticle>[]) => {
            this.articles[storeReference].articlesC = articlesC;
            this.emitArticles(storeReference);
          })
        };
      }
    });
  }

  public emitArticles(storeReference): void
  {
    if (this.articles[storeReference] !== undefined) {
      this.articles[storeReference].subject.next(this.articles[storeReference].articlesC);
    }
  }

  private getFireStoreSubject(storeReference: string): Observable<ICollection<IArticle>[]> {
    return this.fireStore
      .collection<IArticle>(this.getCollectionPath(storeReference))
      .snapshotChanges()
      .pipe(map(actions => actions.map(event => {
        return {
          key: event.payload.doc.id,
          data: event.payload.doc.data()
        };
      })));
  }

  public getSubject(storeReference: string): Subject<ICollection<IArticle>[]>
  {
    return this.articles[storeReference].subject;
  }

  async add(
    storeReference: string,
    article: IArticle
  ): Promise<string> {
    const articleDocument = await this.fireStore.collection(this.getCollectionPath(storeReference)).add(article);
    return articleDocument.id;
  }

  update(
    storeReference: string,
    articleC: ICollection<IArticle>
  ): Promise<void> {
    return this.fireStore.collection(this.getCollectionPath(storeReference)).doc(articleC.key).update(articleC.data);
  }

  public delete(
    storeReference: string,
    articleReference: string
  ): Promise<void> {
    return this.fireStore.collection(this.getCollectionPath(storeReference)).doc(articleReference).delete();
  }
}
