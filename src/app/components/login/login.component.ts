import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, filter, first, map, tap } from 'rxjs';
import { AuthService } from '@app/_services/auth.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
   private subs = new SubSink();
   rememberMe: boolean = false;
   loginForm!: FormGroup;
   loginError = '';
   redirectUrl = '';

   constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute
   ) {
      // this.subs.sink = this.route.paramMap.subscribe(
      //    (params) => {
      //       this.redirectUrl = params.get('redirectUrl') ?? ''
      //    }
      // );

   }

   ngOnInit(): void {
      //this.authService.logout();
      this.buildLoginForm();
   }

   buildLoginForm() {
      this.loginForm = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]],
         password: [
            '',
            [
               Validators.required,
               Validators.minLength(8),
               Validators.maxLength(50),
            ],
         ],
      });
   }

   async login(submitedForm: FormGroup) {
      this.authService.rememberMe = this.rememberMe;
      this.authService
         .login(submitedForm.value.email, submitedForm.value.password)
         .pipe(
            first(),
            //map((res:any) => console.log(res)),
         ).subscribe({
            next: (r) => {
               // get return url from query parameters or default to home page
               const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
               this.router.navigateByUrl(returnUrl);
            },
            error: (error:HttpErrorResponse) => {
               console.error(error.error);
            }
         })
   }

   // Unsubscribe when the component dies
   ngOnDestroy() {
      this.subs.unsubscribe();
   }
}
