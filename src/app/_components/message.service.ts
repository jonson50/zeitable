import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'

import { SimpleDialogComponent } from './simple-dialog.component'

@Injectable({
   providedIn: 'root',
})
export class MessageService {
   constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

   showToast(message: string, action = 'Close', config?: MatSnackBarConfig) {
      // this.snackBar.open(message, action, config || { duration: 7000 })
      let configuration = new MatSnackBarConfig();
      configuration.duration = 7000;
      configuration.horizontalPosition = 'center';
      configuration.verticalPosition = 'top';
      configuration.panelClass = ['w3-red']

      this.snackBar.open(message, action, configuration);
   }

   showDialog(
      title: string,
      content: string,
      okText = 'OK',
      cancelText?: string,
      customConfig?: MatDialogConfig
   ): Observable<boolean> {
      const dialogRef = this.dialog.open(
         SimpleDialogComponent,
         customConfig || {
            width: '300px',
            data: { title, content, okText, cancelText },
         }
      )

      return dialogRef.afterClosed()
   }
}