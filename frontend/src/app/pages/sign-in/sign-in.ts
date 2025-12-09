import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatingSingleLineInput} from '../../core/components/floating-input/floating-Single-line-input';
import {AuthStore} from '../../core/store/authentication/authentication.store';
import {Credentials} from '../../core/store/authentication/model/credentials';
import {SubmitButton} from '../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  imports: [
    FloatingSingleLineInput,
    ReactiveFormsModule,
    SubmitButton,
    TranslatePipe,
  ],
  templateUrl: './sign-in.html',
  standalone: true,
  styleUrl: './sign-in.scss'
})
export default class SignIn {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  userForm = this.fb.group({
    username: this.fb.control<string>("", {validators: [Validators.required]}),
    password: this.fb.control<string>("", {validators: [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$')]}),
  })

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();

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

    const formValue = this.userForm.value;
    console.log('User submitted', formValue);
    const credentials = new Credentials({
      username: formValue.username!,
      password: formValue.password!
    })
    console.log('Credentials submitted', credentials);
    this.authStore.loginUser(credentials);
    //window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
