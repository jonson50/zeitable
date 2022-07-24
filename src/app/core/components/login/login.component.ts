import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '@app/core/_services/auth.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
   private subs = new SubSink();
   rememberMe: boolean = false;
   loginForm!: FormGroup;
   loginError = '';
   redirectUrl = '';

   constructor(
      @Inject(DOCUMENT) private document: Document, 
      private renderer: Renderer2,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute
   ) {}

   ngOnInit(): void {
      this.renderer.setAttribute(this.document.body, 'class', 'theme-light');
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

   login(submitedForm: FormGroup) {
      this.authService.rememberMe = this.rememberMe;
      /* this.authService
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
         }) */
      this.authService.login(submitedForm.value.email, submitedForm.value.password)
      .then(r=>console.log(r.attributes))
      .catch( e => console.log(e))
   }

   // Unsubscribe when the component dies
   ngOnDestroy() {
      this.subs.unsubscribe();
   }
}
