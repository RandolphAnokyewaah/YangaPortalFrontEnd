import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { apiEndpoint } from "../../config";
import { APIService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
import { ToastService } from '../../services/toast-service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  errorMessage: string = "";
  showPassword: boolean = false;
  isLoading: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(
    private apiService: APIService,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService,
  ) {}

  async onSubmit() {
    if (this.isLoading) return;

    this.errorMessage = "";
    if (!this.username || !this.password) {
      this.errorMessage = await this.translateService.get("REQUIRED_EMAIL_PASSWORD").toPromise();
      return;
    }

    this.isLoading = true;

    this.apiService.httpPostRequest(apiEndpoint.USER_LOGIN, {
      username: this.username,
      password: this.password
    }).then(async (res: any) => {
      if (res?.token) {
        this.authService.setToken(res.token);
        this.authService.setLocalStorageData("userrole", res?.user?.role);
        this.toastService.successToast('LOGIN_SUCCESSFUL', true);
        // Optionally navigate to dashboard
      } else {
        this.errorMessage = await this.translateService.get("INVALID_CREDENTIAL").toPromise();
        this.toastService.errorToast(this.errorMessage);
      }
    }).catch(async (error) => {
      console.error("Login Error:", error);
      this.errorMessage = await this.translateService.get("LOGIN_FAILED").toPromise();
      this.toastService.errorToast(this.errorMessage);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
