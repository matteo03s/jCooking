import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatingSingleLineInput} from '../../core/components/floating-input/floating-Single-line-input';
import {Slider} from '../../core/components/slider/slider';
import {FormDropdown} from '../../core/components/form-dropdown/form-dropdown';
import {MenuItem} from '../../core/components/dropdown/dropdown';
import {AuthStore} from '../../core/store/authentication/authentication.store';
import {User} from '../../core/store/authentication/model/user';
import {Credentials} from '../../core/store/authentication/model/credentials';
import {passwordMatchValidator} from '../../core/store/authentication/guard-interceptor/passwordMatchValidator';
import {Gender} from '../../core/store/authentication/enum/genderEnum';
import {Router} from '@angular/router';
import AvatarSelection from '../avatar-selection/avatar-selection';
import {SubmitButton} from '../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    FloatingSingleLineInput,
    Slider,
    FormDropdown,
    AvatarSelection,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './sign-up.html',
  standalone: true,
  styleUrl: './sign-up.scss'
})
export default class SignUp {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  router = inject(Router);

  userForm = this.fb.group({
    name: this.fb.control<string>("", {validators: [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')]}),
    surname: this.fb.control<string>("", {validators: [Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')]}),
    gender: this.fb.control<string>("", {validators: [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')]}),
    age: this.fb.control<number | null>(null, {validators: [Validators.required]}),
    email: this.fb.control<string>("", {validators: [Validators.required, Validators.email]}),
    avatar: this.fb.control<string>("", {validators: [Validators.required]})
  })
  credentialsForm = this.fb.group({
    username: this.fb.control<string>("", {validators: [Validators.required]}),
    password: this.fb.control<string>("", {validators: [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$')]}),
    confirmPassword: this.fb.control<string>("", [Validators.required]),
  },
    { validators: [passwordMatchValidator] }
  )
  genders: MenuItem[] = [
    { label : 'REGISTER.USER.GENDER.FEMALE', value : Gender.FEMALE},
    { label : 'REGISTER.USER.GENDER.MALE', value : Gender.MALE},
    { label : 'REGISTER.USER.GENDER.NON', value : Gender.NONBINARY},
    { label : 'REGISTER.USER.GENDER.OTHER', value : Gender.UNKNOWN}
  ]
  selectedAvatar: string = '';

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.userForm.get('avatar')?.setValue(avatar);
  }

  protected onSubmit(): void {
    if (this.userForm.invalid || this.credentialsForm.invalid) {
      this.userForm.markAllAsTouched();
      this.credentialsForm.markAllAsTouched();

      //Trova il primo campo non valido nel DOM
      const firstInvalidControl: HTMLElement | null = document.querySelector(
        '.ng-invalid:not(form):not(fieldset)'
      );

      if (firstInvalidControl) {
        //Scorre la pagina fino al campo
        firstInvalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});

        //mette il focus sul campo
        firstInvalidControl.focus();
      }
      return;
    }

    const userValue = this.userForm.value;
    const credentialsValue = this.credentialsForm.value;

    // Verifica ulteriore lato client (di sicurezza)
    if (credentialsValue.password !== credentialsValue.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const user = new User({
      name: userValue.name!,
      surname: userValue.surname ?? '', // valore di fallback
      username: credentialsValue.username ?? '',
      email: userValue.email!,
      age: userValue.age!,
      gender: userValue.gender as Gender,
      avatar: userValue.avatar!
    });
    console.log('User submitted', user);
    const credentials = new Credentials({
      username: credentialsValue.username!,
      password: credentialsValue.password!
    });
    console.log('Credentials submitted', credentials);
    this.authStore.registerUser({credentials, user});
  }
}
