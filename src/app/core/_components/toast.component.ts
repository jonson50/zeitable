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
            Notification<br />
            {{ data }}
         </p>
      </div>
   `,
   styles: [
      `
         .notification-toast {
            display: flex;
            align-items: center;
            height: 65px;
         }
         .notification-toast > mat-icon {
            font-size: 45px;
            margin-right: 30px;
            padding: 10px 0;
            height: 100%;
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
