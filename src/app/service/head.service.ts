import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeadService {

  constructor(
    private titleService: Title
  ) { }

  public setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ' + environment.app.name);
  }
}
