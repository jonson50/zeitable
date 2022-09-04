import { Component, Inject, OnInit } from '@angular/core';
import {
   MatSnackBarRef,
   MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
   template: `
      <div class="w3-cell-row">
         <div class="w3-cell w3-cell-middle" style="width:50px">
            <mat-icon aria-hidden="false" aria-label="home icon" class="icond">
               notifications
            </mat-icon>
         </div>
      
         <div class="w3-cell">
            <strong>Notification</strong>
            <p>{{ data }}</p>
         </div>
      </div>
   `,
   styles: [
      `
         .icond {
            font-size: 45px;
            width: 100%;
            height: 100%;
         }
      `,
   ],
})
export class MainToastComponent {
   constructor(
      public sbRef: MatSnackBarRef<MainToastComponent>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any
   ) { }
}
