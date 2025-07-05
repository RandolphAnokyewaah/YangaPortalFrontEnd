import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { APIService } from "./api.service";

export interface Machine {
  id: number;
  location: string;
  isActive: boolean;
  promotions?: any[]; // ✅ add this optional property
}

@Injectable({ providedIn: "root" })
export class MachineService {
  private apiUrl = "/machines"; // Adjust as needed

  constructor(private apiService: APIService) {}

  getMachines(): Observable<Machine[]> {
    return from(this.apiService.httpGetRequest(this.apiUrl)) as Observable<
      Machine[]
    >;
  }

  getStats(): Observable<any> {
    return from(
      this.apiService.httpGetRequest(`${this.apiUrl}/stats`)
    ) as Observable<any>;
  }

  createMachine(machine: Partial<Machine>): Observable<Machine> {
    return from(
      this.apiService.httpPostRequest(this.apiUrl, machine)
    ) as Observable<Machine>;
  }

  updateMachine(id: number, machine: Partial<Machine>): Observable<Machine> {
    return from(
      this.apiService.httpPutRequest(`${this.apiUrl}/${id}`, machine)
    ) as Observable<Machine>;
  }

  deleteMachine(id: number): Observable<void> {
    return from(
      this.apiService.httpDeleteRequest(`${this.apiUrl}/${id}`, null)
    ) as Observable<void>;
  }

  getAssignedPromotions(machineId: number): Observable<any[]> {
    return from(
      this.apiService.httpGetRequest(`${this.apiUrl}/${machineId}/promotions`)
    ) as Observable<any[]>;
  }
  assignPromotion(machineId: number, promotionId: number) {
    return from(
      this.apiService.httpPostRequest(`/machines/assign-promotion`, {
        machineId,
        promotionId,
      })
    );
  }
 unassignPromotion(machineId: number, promotionId: number): Observable<any> {
  return from(this.apiService.httpDeleteRequest(`/machines/${machineId}/promotions/${promotionId}`, null));
}

}
