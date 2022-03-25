import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { combineLatest, filter, tap } from 'rxjs';
import { Router } from '@angular/router';

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
      private authService: AuthService,
      private router: Router
      ) {}

   ngOnInit(): void {}

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

   login(){
      this.authService.login('manager@test.com', '123456');

      combineLatest(
         [this.authService.authStatus$,
            this.authService.currentUser$]
      ).pipe(
         filter(([authStatus, user]) =>
            authStatus.isAuthenticated && user?._id !== ''
         ),
         tap(([authStatus, user]) =>{
            this.router.navigate(['/manager'])
         })
      )
      .subscribe();

   }

   logout() {
      this.authService.logout(true);
      this.router.navigate(['/']);
   }
}
