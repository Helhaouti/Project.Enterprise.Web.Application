import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatDialogConfig} from "@angular/material/dialog/dialog-config";

/**
 * Service for the central management of Angular Material Dialog component usage.
 *
 * @author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog
  ) {
  }

  /**
   * Creates and opens a dialog from the provided component with the provided data.
   */


  openDialogFrom(component: any, data: any): void {
    this.dialog.open(
      component,
      {
        minWidth: '50vw',
        minHeight: '50vh',
        data,
        panelClass: "dialogBaseStyle",
      } as MatDialogConfig
    );
  }

  openHalfScreenSizedDialogFrom(component: any, data: any): void {
    this.dialog.open(
      component,
      {
        width: '90vw',
        maxWidth: '1200px',
        height: '70vh',
        maxHeight: '1200px',
        data,
        panelClass: "dialogBaseStyle",
      } as MatDialogConfig
    );
  }

  openCardSizedDialogFrom(component: any, data: any): void {
    this.dialog.open(
      component,
      {
        width: '90vw',
        maxWidth: '400px',
        height: '70vh',
        maxHeight: '600px',
        data,
        panelClass: "dialogBaseStyle",
      } as MatDialogConfig
    );
  }
}
