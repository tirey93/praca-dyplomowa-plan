import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRepositoryService } from '../../services/authentication/authenticationRepository.service';
import { LoginService } from '../../services/login.service';
import { SnackBarErrorService } from '../../services/snack-bar-error-service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';


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
    private authenticationRepository: AuthenticationRepositoryService,
    private router: Router,
    private loginService: LoginService,
    private snackBarErrorService: SnackBarErrorService,
    private readonly dialog: MatDialog,
  ) {
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

  backdoor() {
    this.tryLogin('string', 'string');
  }

  handleCreateNewUser() {
    this.dialog.open(CreateUserComponent, {
      maxWidth: '30vw',
      autoFocus: false
    })
  }

  onSubmit() {
    this.tryLogin(this.formLogin.controls.username.value!, this.formLogin.controls.password.value!);
  }

  private tryLogin(userName:string, password:string) {
    this.authenticationRepository.tryLogin$({
      userName: userName,
      password: password
    }).subscribe({
      next: (loginResponse) => {
        this.loginService.login(loginResponse.token)
        this.router.navigateByUrl("/week");
      },
      error: (error) => {
        this.snackBarErrorService.open(error);
        this.wrongCredentials = error.status === 404;
        this.noConnection = error.status === 0;
      }
    });
  }
}
