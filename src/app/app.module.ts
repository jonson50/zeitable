import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimpleDialogComponent } from '@app/_components/simple-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Services
import { AuthJwtService } from './auth/auth-jwt.service';
import {
   AuthHttpInterceptor,
   ErrorInterceptor,
   AuthGuard } from '@app/_helpers';
import { AuthService } from '@app/_services';
// Angular CDK
import { LayoutModule } from '@angular/cdk/layout';
import { NgxSpinnerModule } from 'ngx-spinner';
// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';




@NgModule({
   imports: [
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      NgxSpinnerModule,
      AppRoutingModule,
      MatToolbarModule,
      MatSidenavModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      LayoutModule,
      MatMenuModule,
      MatInputModule,
      MatCheckboxModule,
      MatDialogModule,
      MatSnackBarModule,
   ],
   declarations: [
      AppComponent,
      SimpleDialogComponent,
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
         provide: HTTP_INTERCEPTORS,
         useClass: ErrorInterceptor,
         multi: true,
      },
   ],
   bootstrap: [AppComponent],
   entryComponents: [SimpleDialogComponent],
})
export class AppModule {}
