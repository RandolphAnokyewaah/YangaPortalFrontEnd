import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Promotion, PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  loading = false;
  error = '';

  showModal = false;
  isEditMode = false;
  modalPromotion: Partial<Promotion> = { title: '', description: '', startDate: '', endDate: '' };
  editingId: number | null = null;

  constructor(private promotionService: PromotionService) {}

  ngOnInit() {
    this.fetchPromotions();
  }

  fetchPromotions() {
    this.loading = true;
    this.promotionService.getPromotions().subscribe({
      next: (data) => { this.promotions = data; this.loading = false; },
      error: (err) => { this.error = 'Failed to load promotions'; this.loading = false; }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.modalPromotion = { title: '', description: '', startDate: '', endDate: '' };
    this.showModal = true;
    this.editingId = null;
  }

  openEditModal(promotion: Promotion) {
    this.isEditMode = true;
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${d.getFullYear()}-${month}-${day}`;
    };
    this.modalPromotion = {
      ...promotion,
      startDate: formatDate(promotion.startDate),
      endDate: formatDate(promotion.endDate)
    };
    this.showModal = true;
    this.editingId = promotion.id;
  }

  closeModal() {
    this.showModal = false;
    this.modalPromotion = { title: '', description: '', startDate: '', endDate: '' };
    this.editingId = null;
  }

  savePromotion() {
    if (this.isEditMode && this.editingId != null) {
      this.promotionService.updatePromotion(this.editingId, this.modalPromotion).subscribe({
        next: () => { this.fetchPromotions(); this.closeModal(); },
        error: () => { this.error = 'Failed to update promotion'; }
      });
    } else {
      this.promotionService.createPromotion(this.modalPromotion).subscribe({
        next: () => { this.fetchPromotions(); this.closeModal(); },
        error: () => { this.error = 'Failed to create promotion'; }
      });
    }
  }

  deletePromotion(promotion: Promotion) {
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.promotionService.deletePromotion(promotion.id).subscribe({
        next: () => this.fetchPromotions(),
        error: () => { this.error = 'Failed to delete promotion'; }
      });
    }
  }
}
