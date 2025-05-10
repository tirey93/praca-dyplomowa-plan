import { Component, Signal } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule  } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationRepositoryService } from '../services/authenticationRepository.service';
import { UserRepositoryService } from '../services/userRepository.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';


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
    private authenticationRepository: AuthenticationRepositoryService,
    private userRepositoryService: UserRepositoryService,
    private router: Router,
    private jwtService: JwtService) {
      if (jwtService.isTokenValid()) {
        router.navigateByUrl("")
      }  
    }

  formLogin: FormGroup<LoginForm> = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })
  wrongCredentials: boolean = false;
  noConnection: boolean = false;

  onSubmit() {
    this.authenticationRepository.tryLogin$({
      userName: this.formLogin.controls.username.value!,
      password: this.formLogin.controls.password.value!
    }).subscribe({
      next: (loginResponse) => {
        this.cookieService.set("token", loginResponse.token);
        this.userRepositoryService.getLoggedIn$().subscribe(userResponse => {
          this.router.navigateByUrl("/week")
        })
      },
      error: (error) => {
        this.wrongCredentials = error.status === 404;
        this.noConnection = error.status === 0;
      }
    })
  }
}