import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

  constructor(private translateService: TranslateService) {}

  async show(message: string, translate: boolean, classname: string = 'bg-info text-light', delay: number = 3000) {
    if (translate) {
      message = await this.translateService.get(message).toPromise();
    }

    this.toasts.push({ message, classname, delay });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  successToast(message: string, translate: boolean = false) {
    this.show(message, translate, 'bg-success text-light');
  }

  errorToast(message: string, translate: boolean = false) {
    this.show(message, translate, 'bg-danger text-light');
  }

  warningToast(message: string, translate: boolean = false) {
    this.show(message, translate, 'bg-warning text-dark');
  }
}