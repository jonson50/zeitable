import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthJwtService } from 'src/app/auth/auth-jwt.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
   selector: 'app-layout',
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
   @ViewChild(MatSidenav)
   sidenav!: MatSidenav;

   constructor(
      private observer: BreakpointObserver,
      private authJwtService: AuthJwtService,
      private router: Router,
      private http: HttpClient
      ) {}

   ngOnInit(): void {
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
      this.authJwtService.logout(true);
      this.router.navigate(['/login']);
   }
}
