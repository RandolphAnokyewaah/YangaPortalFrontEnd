// Import modules
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { config } from "../config";
import { AuthService } from "./auth.service";

@Injectable()
export class APIService {

  private headerOptions: any;

  constructor(public http: HttpClient, public authService: AuthService) {
  }

  httpGetRequest(apiEndpoint: any, authToken: any = "") {
    return new Promise((resolve, reject) => {

      if (!authToken)
        authToken = this.authService.getToken();

      this.headerOptions = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${authToken}`)
      }

      this.http.get(config.APIBaseUrl + apiEndpoint, this.headerOptions).subscribe((res: any) => {
        return resolve(res);
      }, (error: any) => {
        
        if (error?.status === 401 || error?.error?.statusCode === 401 || error?.error?.message === "Unauthorized") {
          this.authService.logout();
          return reject(error?.message);
        }

        return reject(error);
      })
    });
  }

  httpPostRequest(apiEndpoint: any, bodyData: any = {}, authToken: any = "") {
    return new Promise((resolve, reject) => {
      if (!authToken)
        authToken = this.authService.getToken();

      this.headerOptions = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${authToken}`)
      }

      this.http.post(config.APIBaseUrl + apiEndpoint, bodyData, this.headerOptions).subscribe((res: any) => {
        return resolve(res);
      }, (error: any) => {
        console.log("error : ", error);
        if (error?.status === 401 || error?.error?.statusCode === 401 || error?.error?.message === "Unauthorized") {
          this.authService.logout();
          return reject(error?.error?.message || error?.message || error);
        }

        return reject(error);
      })
    });
  }

  httpPutRequest(apiEndpoint: any, bodyData: any = {}, authToken: any = "") {
    return new Promise((resolve, reject) => {
      if (!authToken)
        authToken = this.authService.getToken();

      this.headerOptions = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${authToken}`)
      }

      this.http.put(config.APIBaseUrl + apiEndpoint, bodyData, this.headerOptions).subscribe((res: any) => {
        return resolve(res);
      }, (error: any) => {
        console.log("error : ", error);
        if (error?.status === 401 || error?.error?.statusCode === 401 || error?.error?.message === "Unauthorized") {
          this.authService.logout();
          return reject(error?.error?.message || error?.message || error);
        }

        return reject(error);
      })
    });
  }

httpDeleteRequest(apiEndpoint: any, authToken: any = "") {
  return new Promise((resolve, reject) => {
    if (!authToken) {
      authToken = this.authService.getToken();
    }

    // ✅ Debug print here
    console.log("Auth Token:", authToken);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    this.http.delete(config.APIBaseUrl + apiEndpoint, { headers }).subscribe(
      (res: any) => {
        return resolve(res);
      },
      (error: any) => {
        console.log("DELETE error:", error);

        const isMemberDelete = apiEndpoint.includes('/members');

        if (
          (error?.status === 401 || error?.error?.statusCode === 401 || error?.error?.message === "Unauthorized") &&
          !isMemberDelete
        ) {
          this.authService.logout();
          return reject(error?.error?.message || error?.message || error);
        }

        return reject(error);
      }
    );
  });
}
}