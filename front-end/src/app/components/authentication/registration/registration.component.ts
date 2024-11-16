import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../../services/authentication/auth.service";
import {UserCreationRequest} from "../../../domain/dto/UserCreationRequest";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  public formPresent: boolean = false;

  public form!: FormGroup;

  public credentialsGroup!: FormGroup;
  public userDetailsGroup!: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.initFormGroup();
  }

  private initFormGroup(): void {
    this.form = this.fb.group(
      {
        credentials: this.fb.group({
          username: ["", Validators.required],
          password: this.fb.group({
            password: ["", Validators.required],
            rePassword: ["", Validators.required]
          })
        }),
        userDetails: this.fb.group({
          firstName: ["", Validators.required],
          lastName: ["", Validators.required],
          email: ["", [Validators.required, Validators.email]],
          countryCode: ["", Validators.required],
        })
      }
    );

    this.credentialsGroup = this.form.get("credentials") as FormGroup;
    this.userDetailsGroup = this.form.get("userDetails") as FormGroup;

    this.credentialsGroup.get("password")!.addValidators(this.passwordConfirmer);
  }

  public save(): void {
    const registerRequest: UserCreationRequest = new UserCreationRequest(
      this.userDetailsGroup.get("firstName")?.value,
      this.userDetailsGroup.get("lastName")?.value,
      this.credentialsGroup.get("username")?.value,
      this.credentialsGroup.get("password")?.get("password")?.value,
      this.userDetailsGroup.get("email")?.value,
      this.userDetailsGroup.get("countryCode")?.value
    );

    this.auth.register(registerRequest, "/profile");
  }

  private passwordConfirmer: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let password = group.get('password')!.value;
    let rePassword = group.get('rePassword')!.value;
    return password === rePassword ? null : {notSame: true};
  }
}
