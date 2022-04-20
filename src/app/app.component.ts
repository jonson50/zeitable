import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
   typeSelected: string;

   constructor() {
      this.typeSelected = 'ball-scale-multiple';
   }

   ngOnInit(): void {}
}
