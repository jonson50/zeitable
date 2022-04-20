import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';

@Component({
   selector: 'app-temporal-home',
   templateUrl: './temporal-home.component.html',
   styleUrls: ['./temporal-home.component.css'],
})
export class TemporalHomeComponent implements OnInit {
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
