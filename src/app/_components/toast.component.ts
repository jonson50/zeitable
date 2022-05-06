import { Component, Inject, OnInit } from '@angular/core';
import {
   MatSnackBarRef,
   MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
   template: `
      <div class="notification-toast">
         <mat-icon aria-hidden="false" aria-label="home icon">
            notifications
         </mat-icon>
         <p class="information">
            <strong>Notification</strong><br />
            {{ data }}
         </p>
      </div>
   `,
   styles: [
      `
         .notification-toast {
            display: flex;
         }
         .notification-toast > mat-icon {
            font-size: 35px;
            margin-right: 20px;
         }
      `,
   ],
})
export class MainToastComponent {
   constructor(
      public sbRef: MatSnackBarRef<MainToastComponent>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any
   ) {}
}
