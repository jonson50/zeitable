import { Component } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent {
   typeSelected: string;

   constructor() {
      this.typeSelected = 'ball-scale-multiple';
   }
}
