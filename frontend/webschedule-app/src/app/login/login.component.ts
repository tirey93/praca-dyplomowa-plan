import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule  } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationRepositoryService } from './services/authentication-repository.service';


interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private cookieService: CookieService, 
    private authenticationRepository: AuthenticationRepositoryService) {}

  formLogin: FormGroup<LoginForm> = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })

  onSubmit() {
    console.log(this.formLogin.controls.username.value, this.formLogin.controls.password.value)
    this.cookieService.set("test", "1234");
    // console.log(this.cookieService.get("test"))
    this.authenticationRepository.tryLogin$({
      userName: this.formLogin.controls.username.value!,
      password: this.formLogin.controls.password.value!
    }).subscribe(userResponse => {
      console.log(userResponse)
    })
  }
}
