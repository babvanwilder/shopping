import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from 'src/app/shopping/service/store.service';
import { ArticleService } from 'src/app/shopping/service/article.service';
import { ICollection } from 'src/app/interface/collection';
import { IStore } from 'src/app/shopping/interface/store';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IArticle } from '../../interface/article';
import { ToastService } from 'src/app/toast/service/toast.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { faTrashAlt, faPlus, faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  public articlesC: ICollection<IArticle>[];
  private storeReference: string;
  public store: IStore;
  private storesSubScription: Subscription;
  private articlesSubscription: Subscription;
  public addArticleModalOpen: boolean;
  public addArticleForm: FormGroup;
  public addArticleAlert: string;
  public addArticleAlertExist: string;
  public faPlus = faPlus;
  public faTrashAlt = faTrashAlt;
  public faPen = faPen;
  public faEye = faEye;
  public updateArticleForm: FormGroup;
  public updateArticleAlert: string;
  public updateArticleModalOpen: boolean;
  public updateArticleAlertExist: string;

  constructor(
    private storeService: StoreService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private headService: HeadService
  ) { }

  public ngOnInit(): void {
    this.articlesC = [];
    const storeC = this.route.snapshot.data.store;
    if (storeC === null) {
      this.router.navigateByUrl('404', {
        skipLocationChange: true,
        replaceUrl: false
      });
      throw Error('404');
    }
    this.headService.setTitle(storeC.data.name);
    this.storeReference = storeC.key; // this.route.snapshot.paramMap.get('id');
    this.store = storeC.data;

    this.storesSubScription = this.storeService.storesSubject.subscribe((collection: ICollection<IStore>[]) => {
      const stores = collection.filter((store: ICollection<IStore>) => {
        return this.storeReference === store.key;
      });
      if (stores.length < 1) {
        this.router.navigate(['']);
      } else {
        this.store = stores[0].data;
      }
    });
    this.storeService.emitStores();
    this.articlesSubscription = this.articleService
      .getSubject(this.storeReference)
      .subscribe((articlesC: ICollection<IArticle>[]) => {
        if (articlesC === undefined) {
          articlesC = [];
        }
        this.articlesC = articlesC.sort((firstArticleC: ICollection<IArticle>, secondArticleC: ICollection<IArticle>): number => {
          const firstName = firstArticleC.data.name.toLowerCase();
          const secondName = secondArticleC.data.name.toLowerCase();
          return firstName < secondName ? -1 : (firstName > secondName ? 1 : 0);
        });
      });
    this.articleService.emitArticles(this.storeReference);

    this.addArticleModalOpen = false;
    this.initAddArticleForm();
    this.updateArticleModalOpen = false;
    this.initUpdateArticleForm({
      key: '',
      data: {
        name: '',
        quantity: 0,
        mask: false,
        photoUrl: '',
        buy: false
      }
    });
  }

  private initAddArticleForm(): void {
    this.addArticleForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required
      ]),
      quantity: new FormControl(1, [
        Validators.required
      ])
    });
  }

  public toogleModalAddArticle(): void {
    if (!this.addArticleModalOpen) {
      this.initAddArticleForm();
    }
    this.addArticleModalOpen = !this.addArticleModalOpen;
  }

  private addArticle(): Promise<string> {
    const values = this.addArticleForm.value;
    return this.articleService.add(this.storeReference, {
      name: values.name,
      quantity: values.quantity,
      buy: false,
      photoUrl: '',
      mask: false
    });
  }

  private checkArticleExist(): ICollection<IArticle>[] {
    const values = this.addArticleForm.value;
    return this.articlesC.filter((articleC: ICollection<IArticle>): boolean => {
      return values.name.toLowerCase() === articleC.data.name.toLowerCase();
    });
  }

  public onSubmitAdd(): void {
    delete this.addArticleAlert;
    const sameArticles = this.checkArticleExist();
    if (sameArticles.length === 0) {
      this.addArticle().then(() => {
        this.addArticleAlert = 'Votre article a bien été ajouté à la liste.';
        this.initAddArticleForm();
        setTimeout(() => {
          delete this.addArticleAlert;
        }, 5000);
      }).catch(() => {
        this.addArticleAlert = 'Une erreur est survenue lors de l\'ajout de l\'article.';
      });
    } else {
      alert('do update');
    }
  }

  public onSubmitAddAndClose(): void {
    delete this.addArticleAlert;
    const sameArticles = this.checkArticleExist();
    if (sameArticles.length === 0) {
      this.addArticle().then(() => {
        this.toogleModalAddArticle();
        this.toastService.addToast('Ajout d\'un article', 'Votre article a bien été ajouté à la liste.');
      }).catch(() => {
        this.addArticleAlert = 'Une erreur est survenue lors de l\'ajout de l\'article.';
      });
    } else {
      alert('do update');
    }
  }

  public onCheckExist(): void {
    const sameArticle = this.checkArticleExist();
    if (sameArticle.length > 0) {

    }
  }

  public deleteArticle(articleC: ICollection<IArticle>): void {
    const title = 'Suppression de \'' + articleC.data.name + '\'';
    this.articleService.delete(this.storeReference, articleC.key).then(() => {
      this.toastService.addToast(title, 'Suppression terminée.');
    }).catch(() => {
      this.toastService.addToast(title, 'Erreur lors de la suppression.');
    });
  }

  private updateArticle(articleC: ICollection<IArticle>): void {
    const title = 'Modification de \'' + articleC.data.name + '\'';
    this.articleService
      .update(this.storeReference, articleC)
      .then(() => {
        this.toastService.addToast(title, 'Modification effectuée avec succès.');
      })
      .catch(() => {
        this.toastService.addToast(title, 'Erreur lors de la modification.');
      });
  }

  public onUpdateArticleBuy(articleC: ICollection<IArticle>): void {
    articleC.data.buy = !articleC.data.buy;
    this.updateArticle(articleC);
  }

  public onUpdateArticleMask(articleC: ICollection<IArticle>): void {
    articleC.data.mask = !articleC.data.mask;
    this.updateArticle(articleC);
  }

  private initUpdateArticleForm(articleC: ICollection<IArticle>): void {
    this.updateArticleForm = this.formBuilder.group({
      id: new FormControl(articleC.key, [
        Validators.required
      ]),
      name: new FormControl(articleC.data.name, [
        Validators.required
      ]),
      quantity: new FormControl(articleC.data.quantity, [
        Validators.required
      ])
    });
  }

  public toogleModalUpdateArticle(articleC: ICollection<IArticle> = null): void {
    if (!this.updateArticleModalOpen) {
      this.initUpdateArticleForm(articleC);
    }
    this.updateArticleModalOpen = !this.updateArticleModalOpen;
  }

  public onSubmitUpdate(): void {
    alert('updateValidationSubmit');
    const values = this.updateArticleForm;
  }

  ngOnDestroy(): void {
    if (this.storesSubScription !== undefined) {
      this.storesSubScription.unsubscribe();
    }
    if (this.articlesSubscription !== undefined) {
      this.articlesSubscription.unsubscribe();
    }
  }

}
