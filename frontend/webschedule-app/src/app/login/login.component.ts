import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRepositoryService } from '../../services/authentication/authenticationRepository.service';
import { LoginService } from '../../services/login.service';
import { SnackBarService } from '../../services/snackBarService';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';


interface LoginForm {
  login: FormControl<string | null>;
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
    private authenticationRepository: AuthenticationRepositoryService,
    private router: Router,
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
  ) {
    }

  formLogin: FormGroup<LoginForm> = new FormGroup({
    login: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })
  wrongCredentials: boolean = false;
  noConnection: boolean = false;

  backdoor() {
    this.tryLogin('student18', 'string');
  }

  handleCreateNewUser() {
    this.dialog.open(CreateUserComponent, {
      maxWidth: '30vw',
      autoFocus: false
    })
  }

  onSubmit() {
    this.tryLogin(this.formLogin.controls.login.value!, this.formLogin.controls.password.value!);
  }

  private tryLogin(login:string, password:string) {
    this.authenticationRepository.tryLogin$({
      login: login,
      password: password
    }).subscribe({
      next: (loginResponse) => {
        this.loginService.login(loginResponse.token)
        this.router.navigateByUrl("");
      },
      error: (error) => {
        this.snackBarService.openError(error);
        this.wrongCredentials = error.status === 404;
        this.noConnection = error.status === 0;
      }
    });
  }
}
