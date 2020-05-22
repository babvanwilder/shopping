import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { IStore } from '../interface/store';
import { StoreService } from '../service/store.service';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICollection } from 'src/app/interface/collection';

@Injectable({ providedIn: 'root' })
export class StoreResolver implements Resolve<ICollection<IStore>> {
  constructor(
    private storeService: StoreService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot
  ): ICollection<IStore> | Observable<ICollection<IStore>> | Promise<ICollection<IStore>> {
    return this.storeService.get(route.paramMap.get('id'))/*.pipe<IStore>(first()).toPromise()*/;
  }
}
