import {Component, inject} from "@angular/core";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserStore} from '../../../core/store/authentication/user.store';
import {User} from '../../../core/store/authentication/model/user';
import {FloatingSingleLineInput} from '../../../core/components/floating-input/floating-Single-line-input';
import {FormDropdown} from '../../../core/components/form-dropdown/form-dropdown';
import {Slider} from '../../../core/components/slider/slider';
import {MenuItem} from '../../../core/components/dropdown/dropdown';
import {Gender} from '../../../core/store/authentication/enum/genderEnum';
import AvatarSelection from '../../avatar-selection/avatar-selection';
import {SubmitButton} from '../../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-update',
  imports: [
    FloatingSingleLineInput,
    FormDropdown,
    Slider,
    ReactiveFormsModule,
    AvatarSelection,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './user-update.html',
  styleUrl: '../../sign-up/sign-up.scss'
})
export default class UserUpdate {

  fb = inject(FormBuilder);
  userStore = inject(UserStore);
  initialUser: User | null = null;


  genders: MenuItem[] = [
    { label : 'REGISTER.USER.GENDER.FEMALE', value : Gender.FEMALE},
    { label : 'REGISTER.USER.GENDER.MALE', value : Gender.MALE},
    { label : 'REGISTER.USER.GENDER.NON', value : Gender.NONBINARY},
    { label : 'REGISTER.USER.GENDER.OTHER', value : Gender.UNKNOWN}
  ]

  userForm = this.fb.group({
    name: this.fb.control<string>("", {validators: [Validators.required]}),
    surname: this.fb.control<string>(""),
    gender: this.fb.control<string>("", {validators: [Validators.required]}),
    age: this.fb.control<number | null>(null, {validators: [Validators.required]}),
    email: this.fb.control<string>("", {validators: [Validators.required, Validators.email]}),
    username: this.fb.control<string | null>(""),
    avatar: this.fb.control<string>("", {validators: [Validators.required]})
  });

  ngOnInit() {
    this.initialUser = this.userStore.currentUser();
    console.log(this.initialUser)
    if (this.initialUser) {
      this.userForm.patchValue({
        name: this.initialUser.name,
        surname: this.initialUser.surname,
        gender: this.initialUser.gender,
        age: this.initialUser.age,
        email: this.initialUser.email,
        username: this.initialUser.username,
        avatar: this.initialUser.avatar
      });
    }
  }

  selectedAvatar: string = '';

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.userForm.get('avatar')?.setValue(avatar);
  }

  submitForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      const firstInvalidControl = document.querySelector('.ng-invalid:not(form):not(fieldset)');
      firstInvalidControl?.scrollIntoView({behavior: 'smooth', block: 'center'});
      (firstInvalidControl as HTMLElement)?.focus();
      return;
    }
    const formValue = this.userForm.value;
    const user = new User({
      id: this.initialUser?.id,
      name: formValue.name!,
      surname: formValue.surname!,
      gender: formValue.gender as Gender,
      age: formValue.age!,
      email: formValue.email!,
      username: formValue.username!,
      avatar: formValue.avatar!
    });
    console.log(user)
    this.userStore.updateUser(user);
  }
}
