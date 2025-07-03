// Import modules
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { LOCAL_STORAGE } from "../config";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  authToken: any;
  closeResult: any;
  showPassword: boolean = false;

  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable for components

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
    if (authToken)
      this.router.navigate(["/"]); // Redirect to profile page
  }

  logout() {
    this.removeLocalStorageData("userId");
    this.removeLocalStorageData(LOCAL_STORAGE.userToken);
    this.isLoggedInSubject.next(false); // Notify components that user is logged out
    this.router.navigate(["/login"]); // Redirect to login page
  }

  setToken(token: string): void {
    this.authToken = token;
    this.isLoggedInSubject.next(true);
    this.setLocalStorageData(LOCAL_STORAGE.userToken, token);
    this.router.navigate(["/"]); // Redirect after login
  }

  getToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    } else {
      const token = this.getLocalStorageData(LOCAL_STORAGE.userToken, "string");
      this.authToken = token; // Store in memory
      return token;
    }
  }

  setLocalStorageData(itemName: any, itemValue: any) {
    if (itemValue !== "" && itemValue !== null) {  // Fix condition
      localStorage.setItem(itemName, itemValue);
    }
  }

  getLocalStorageData(itemName: any, dataType: any): string | null {
    let itemValue: any = null;
    itemValue = localStorage.getItem(itemName) ? localStorage.getItem(itemName) : null;
    if (dataType === "json")
      itemValue = JSON.parse(itemValue);

    return itemValue != "" ? itemValue : null;
  }

  removeLocalStorageData(itemName: any) {
    localStorage.removeItem(itemName);
    delete this.authToken;
  }
}