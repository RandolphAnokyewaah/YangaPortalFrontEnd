import { Component, TemplateRef } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast instanceof TemplateRef;
  }
}
