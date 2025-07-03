import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { Observable, from } from 'rxjs';


export enum UserRole {'Admin','Marketing','Support','User'};

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
}




@Injectable({ providedIn: 'root' })
export class UserService {
  private endpoint = '/users';

  constructor(private api: APIService) {}

 getUsers(): Observable<User[]> {
return from(this.api.httpGetRequest(this.endpoint)) as Observable<User[]>;
}

createUser(user: Partial<User>): Observable<any> {
return from(this.api.httpPostRequest(this.endpoint, user)) as Observable<User>;
}

updateUser(id: number, user: Partial<User>): Observable<any> {
  return from(this.api.httpPutRequest(`${this.endpoint}/${id}`, user)) as Observable<User>;
}

deleteUser(id: number): Observable<void> {
  return from(this.api.httpDeleteRequest(`${this.endpoint}/${id}`)) as Observable<void> ;
}
}
