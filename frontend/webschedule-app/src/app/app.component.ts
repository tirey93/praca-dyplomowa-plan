import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import {MatMenuModule} from '@angular/material/menu';
import { JwtService } from './services/jwt.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { UserRepositoryService } from './services/user/userRepository.service';
import { GroupHelper } from './helpers/groupHelper';
import { ToolbarComponent } from "./toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCheckboxModule, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
