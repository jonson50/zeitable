import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SimpleDialogComponent } from '../utils/simple-dialog.component';
import { MainToastComponent } from '../utils/toast.component';


@Injectable({
   providedIn: 'root',
})
export class MessageService {
   constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

   showToast(
      message: string,
      type: string,
      duration = 2000,
      config?: MatSnackBarConfig
   ) {
      // this.snackBar.open(message, action, config || { duration: 7000 })
      let configuration = new MatSnackBarConfig();
      configuration.data = message;
      configuration.duration = duration;
      configuration.horizontalPosition = 'center';
      configuration.verticalPosition = 'top';
      configuration.panelClass = [type];

      //this.snackBar.open(message, action, configuration);
      this.snackBar.openFromComponent(MainToastComponent, configuration)
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
      );

      return dialogRef.afterClosed();
   }
}
