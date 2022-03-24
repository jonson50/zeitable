import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Services
import { AuthService } from './auth/auth.service';
import { InMemoryAuthService } from './auth/auth-inmemory.service';
// Angular CDK
import { LayoutModule } from '@angular/cdk/layout';
// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
   declarations: [AppComponent, LayoutComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatToolbarModule,
      MatSidenavModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      LayoutModule,
      MatMenuModule,
   ],
   providers: [
      {
         provide: AuthService,
         useClass: InMemoryAuthService
      }
   ],
   bootstrap: [AppComponent],
})
export class AppModule {}
