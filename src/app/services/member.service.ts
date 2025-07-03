import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { APIService } from './api.service';

export interface Member {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = '/members'; // Adjust as needed

  constructor(private apiService: APIService) {}

  getMembers(): Observable<Member[]> {
    return from(this.apiService.httpGetRequest(this.apiUrl)) as Observable<Member[]>;
  }

  createMember(member: Partial<Member>): Observable<Member> {
    return from(this.apiService.httpPostRequest(this.apiUrl, member)) as Observable<Member>;
  }

  updateMember(id: number, member: Partial<Member>): Observable<Member> {
    return from(this.apiService.httpPutRequest(`${this.apiUrl}/${id}`, member)) as Observable<Member>;
  }

  deleteMember(id: number): Observable<void> {
    return from(this.apiService.httpDeleteRequest(`${this.apiUrl}/${id}`, {})) as Observable<void>;
  }
}
