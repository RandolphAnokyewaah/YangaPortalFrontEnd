import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { APIService } from './api.service';

export interface Promotion {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private apiUrl = '/promotions'; // Adjust as needed

  constructor(private apiService: APIService) {}

  getPromotions(): Observable<Promotion[]> {
    return from(this.apiService.httpGetRequest(this.apiUrl)) as Observable<Promotion[]>;
  }

  createPromotion(promotion: Partial<Promotion>): Observable<Promotion> {
    return from(this.apiService.httpPostRequest(this.apiUrl, promotion)) as Observable<Promotion>;
  }

  updatePromotion(id: number, promotion: Partial<Promotion>): Observable<Promotion> {
    return from(this.apiService.httpPutRequest(`${this.apiUrl}/${id}`, promotion)) as Observable<Promotion>;
  }

  deletePromotion(id: number): Observable<void> {
    return from(this.apiService.httpDeleteRequest(`${this.apiUrl}/${id}`, {})) as Observable<void>;
  }
}
