import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackbarData} from "../snackbar.service";

/**
 * A basic implementation of snackbar.
 *
 * @author Hamza el Haouti
 */
@Component({
  selector: 'standard-snackbar',
  templateUrl: './standard-snackbar.component.html',
  styleUrls: ['./standard-snackbar.component.scss']
})
export class StandardSnackbarComponent {

  constructor(
    public snackbar: MatSnackBarRef<StandardSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData
  ) {
  }

}
