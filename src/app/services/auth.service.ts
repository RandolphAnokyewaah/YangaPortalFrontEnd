// src/app/services/auth.service.ts
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { LOCAL_STORAGE } from "../config";
import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  username: string;
  role: string;
  exp?: number;
  iss?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authToken: any;
  closeResult: any;
  showPassword: boolean = false;

  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(public router: Router) {
    this.loadAuthState();
  }

  private loadAuthState() {
    const token = this.getToken();
    if (token) {
      this.authToken = token;
      this.isLoggedInSubject.next(true);
    }
  }

  checkAuth() {
    const authToken = this.getToken();
    if (authToken) this.router.navigate(["/"]);
  }

  logout() {
    this.removeLocalStorageData("userId");
    this.removeLocalStorageData(LOCAL_STORAGE.userToken);
    this.isLoggedInSubject.next(false);
    this.router.navigate(["/login"]);
  }

  setToken(token: string): void {
    this.authToken = token;
    this.isLoggedInSubject.next(true);
    this.setLocalStorageData(LOCAL_STORAGE.userToken, token);
    this.router.navigate(["/"]);
  }

  getToken(): string | null {
    if (this.authToken) return this.authToken;

    const token = this.getLocalStorageData(LOCAL_STORAGE.userToken, "string");
    this.authToken = token;
    return token;
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.username;
    } catch {
      return null;
    }
  }
  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded?.username || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  setLocalStorageData(itemName: any, itemValue: any) {
    if (itemValue !== "" && itemValue !== null) {
      localStorage.setItem(itemName, itemValue);
    }
  }

  getLocalStorageData(itemName: any, dataType: any): string | null {
    let itemValue: any = localStorage.getItem(itemName) || null;
    if (dataType === "json") itemValue = JSON.parse(itemValue);
    return itemValue != "" ? itemValue : null;
  }

  removeLocalStorageData(itemName: any) {
    localStorage.removeItem(itemName);
    delete this.authToken;
  }
}
