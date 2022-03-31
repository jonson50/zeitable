import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Services
import { AuthService } from './auth/auth.service';
import { InMemoryAuthService } from './auth/auth-inmemory.service';
import { AuthGuard } from './auth/auth-guard.service';
// Angular CDK
import { LayoutModule } from '@angular/cdk/layout';
// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthHttpInterceptor } from './interceptors/auth-http.interceptor';



@NgModule({
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatSidenavModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      LayoutModule,
      MatMenuModule,
      MatInputModule,
      MatCheckboxModule,
   ],
   declarations: [
      AppComponent,
      routingComponents,
   ],
   providers: [
      AuthGuard,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthHttpInterceptor,
         multi: true,
      },
      {
         provide: AuthService,
         useClass: InMemoryAuthService
      },
   ],
   bootstrap: [AppComponent],
})
export class AppModule {}
