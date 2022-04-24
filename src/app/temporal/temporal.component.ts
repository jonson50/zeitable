import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';

@Component({
   selector: 'app-temporal',
   templateUrl: './temporal.component.html',
   styleUrls: ['./temporal.component.scss'],
})
export class TemporalComponent implements OnInit {
   constructor(private service: AuthService) {}

   ngOnInit(): void {}

   prueba(): void {
      this.service.personas().subscribe(r => {
         console.log(r)
      });
   }
   prueba2() {
      //console.log(this.service.getToken());
   }
}
