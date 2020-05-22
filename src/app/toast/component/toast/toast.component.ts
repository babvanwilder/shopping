import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../service/toast.service';
import { IToast } from '../../interface/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  public toasts: IToast[] = [];
  private toastSubscription: Subscription;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastSubject.subscribe((toasts: IToast[]) => {
      this.toasts = toasts;
    });
    this.toastService.emitToast();
  }

  ngOnDestroy(): void
  {
    this.toastSubscription.unsubscribe();
  }

}
