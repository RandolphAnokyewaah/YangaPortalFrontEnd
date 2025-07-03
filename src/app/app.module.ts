import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // ✅ Required for ngModel
import { HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './pages/toast/toast.component';
import { AppComponent } from "./app.component";
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { CommonModule } from "@angular/common";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ToastComponent,
    DashboardLayoutComponent,
    SidebarComponent,
    TopbarComponent,
    MachinesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgbToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [],
  exports: [ToastComponent, TopbarComponent, SidebarComponent, DashboardLayoutComponent, MachinesComponent],
})
export class AppModule { }
