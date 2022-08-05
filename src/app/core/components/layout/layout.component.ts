import { AfterViewInit, Component, EventEmitter, HostBinding, Inject, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '@app/core/_services/auth.service';
import { Observable } from 'rxjs';
import { Account } from '@app/core/_models/account';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-layout',
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
   private isDark = false;
   // @HostBinding('class')
   // get themeMode() {
   //    return this.isDark ? 'theme-dark' : 'theme-light';
   // }
   @ViewChild(MatSidenav)
   sidenav!: MatSidenav;

   currentAccount!: Observable<Account>;

   constructor(
      @Inject(DOCUMENT) private document: Document, 
      private renderer: Renderer2,
      private observer: BreakpointObserver,
      private authService: AuthService
      ) {}

   ngOnInit(): void {
      this.renderer.setAttribute(this.document.body, 'class', 'theme-light');
      this.currentAccount = this.authService.account$;
   }

   ngAfterViewInit() {
      // Solucion para cuando se cambia un valor en un componente del DOM
      Promise.resolve().then(() => {
         this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
            if (res.matches) {
               this.sidenav.mode = 'over';
               this.sidenav.close();
            } else {
               this.sidenav.mode = 'side';
               this.sidenav.open();
            }
         });
      });
   }

   logout() {
      this.authService.logout();
   }

   onDarkModeSwitched({checked}: MatSlideToggleChange) {
      const hostClass = checked ? 'theme-dark' : 'theme-light';
      this.renderer.setAttribute(this.document.body, 'class', hostClass);
   }
}
