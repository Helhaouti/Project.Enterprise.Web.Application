import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {StandardSnackbarComponent} from "./standard-snackbar/standard-snackbar.component";

export interface SnackbarData {
  message: string,
  action: string | undefined
}

/**
 /**
 * Service for the central management of Angular Material Snackbar component usage.
 *
 * @author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private SNACK_BAR_DURATION: number = 4000;

  constructor(private snackBar: MatSnackBar) {
  }

  /**
   * A method to the directly display an error message from an HTTP request.
   */
  displayErrorMessage = (error: any) => {
    this.openWarningSnackbar({action: undefined, message: `${error.error}`});
  }

  /**
   * Creates a snackbar with alarming styling. And gives the ability to subscribe to the action.
   */
  openWarningSnackbar(data: SnackbarData): Observable<void> {
    const WARNING_CONFIG: MatSnackBarConfig = {
      duration: this.SNACK_BAR_DURATION,
      verticalPosition: "bottom",
      horizontalPosition: "left",
      data: data,
      panelClass: ["snackbarBaseStyle", "snackbarWarningStyle"],
    };

    return this.snackBar.openFromComponent(StandardSnackbarComponent, WARNING_CONFIG).onAction();
  }

  /**
   * Creates a snackbar with alarming styling. And gives the ability to subscribe to the action.
   */
  openSuccesSnackbar(data: SnackbarData): Observable<void> {
    const SUCCES_CONFIG: MatSnackBarConfig = {
      duration: this.SNACK_BAR_DURATION,
      verticalPosition: "bottom",
      horizontalPosition: "left",
      data: data,
      panelClass: ["snackbarBaseStyle", "snackbarSuccesStyle"],
    };

    return this.snackBar.openFromComponent(StandardSnackbarComponent, SUCCES_CONFIG).onAction();
  }

}
