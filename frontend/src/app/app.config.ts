import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { MessageService } from 'primeng/api';
import { GlobalErrorHandlerService } from './core/GlobalError.handler';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptor])),
    MessageService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
  ],
};
