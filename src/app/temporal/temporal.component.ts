import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth-parse.service';

@Component({
   selector: 'app-temporal',
   templateUrl: './temporal.component.html',
   styleUrls: ['./temporal.component.css'],
})
export class TemporalComponent implements OnInit {
   constructor(private service: AuthService) {}

   ngOnInit(): void {}

   prueba(): void {
      let a = 'una cadena';
      let b = { d: 'sfsdf', c: {e: 'werwer', f: 'sdfsdfsdf'}}
      console.log(a)
      console.log(b)
      //this.service.setAlgo(b);
   }
   prueba2() {
      console.log(this.service.getToken());
   }
}
