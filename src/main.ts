import 'zone.js'; // Necesario para Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    ...appConfig.providers, // si definiste providers en appConfig
  ],
}).catch((err) => console.error(err));
