import { Injectable } from '@angular/core';
import { Toast } from '../model/toast';
import { Subject } from 'rxjs';
import { IToast } from '../interface/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: IToast[] = [];
  public toastSubject = new Subject<Toast[]>();

  constructor() { }

  public emitToast(): void {
    this.toastSubject.next(this.toasts);
  }

  public addToast(title: string, content: string, delay = 5000) {
    const toast = new Toast(title, content);
    this.toasts.push(toast);
    this.emitToast();
    setTimeout(() => {
      this.removeToast(toast);
    }, delay);
  }

  private removeToast(removedToast: IToast) {
    this.toasts = this.toasts.filter(toast => toast !== removedToast);
    this.emitToast();
  }
}
