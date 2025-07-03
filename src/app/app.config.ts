import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";

// Import Services
import { APIService } from "./services/api.service";
import { AuthService } from "./services/auth.service";

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { routes } from "./app.routes";

// Function to load translation JSON files
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const appConfig: ApplicationConfig = {
  providers: [
    APIService,
    AuthService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    TranslateService,
  ],
};