import {Component, OnInit} from '@angular/core';
import {User} from "../../../domain/models/user.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PlayerRepository} from "../../../repositories/player.repository";
import {UpdateUserRequest} from "../../../domain/dto/UpdateUserRequest";
import {AuthService} from "../../../services/authentication/auth.service";
import {DialogService} from "../../../services/dialog/dialog.service";
import {
  UserDetailChangeConformationComponent
} from "./user-detail-change-conformation/user-detail-change-conformation.component";

/**
 * A component where the currently logged in user can view and optionally edit his account informations.
 *
 * @author Hamza el Haouti
 */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user!: User;
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder,
              private playerRepo: PlayerRepository,
              private dialogService: DialogService,
              private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(user => this.user = user!);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      username: [this.user.username,],
      password: ["",],
      firstName: [this.user.firstName,],
      lastName: [this.user.lastName,],
      email: [this.user.email, Validators.email],
      countryCode: [this.user.countryCode],
    });
  }

  canSubmit(): boolean {
    let email: FormControl = this.formGroup.get("email") as FormControl;

    return this.formGroup.dirty && email.valid;
  }

  submit(): void {
    let updateUserRequest: UpdateUserRequest = new UpdateUserRequest(
      this.user.id,
      this.checkIfNotEqualToS1(this.user.username, this.formGroup.get("username")?.value),
      this.checkIfNotEqualToS1(this.user.firstName, this.formGroup.get("firstName")?.value),
      this.checkIfNotEqualToS1(this.user.lastName, this.formGroup.get("lastName")?.value),
      this.checkIfNotEqualToS1(this.user.email, this.formGroup.get("email")?.value),
      this.checkIfNotEqualToS1(this.user.countryCode, this.formGroup.get("countryCode")?.value),
      this.checkIfNotEqualToS1("", this.formGroup.get("password")?.value)
    );

    this.dialogService.openHalfScreenSizedDialogFrom(UserDetailChangeConformationComponent, updateUserRequest);
  }

  /**
   * Checks if s2 is differs from s1, if so, it then returns s2, otherwise it returns null.
   *
   * @param s1
   * @param s2
   */
  private checkIfNotEqualToS1(s1: string, s2: string): string | null {
    if (s1.trim() === s2.trim()) return null;
    return s2;
  }
}
