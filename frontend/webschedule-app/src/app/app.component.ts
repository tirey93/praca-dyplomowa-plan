import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import {MatMenuModule} from '@angular/material/menu';
import { JwtService } from './services/Jwt.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private jwtService: JwtService) {}
  title = 'webschedule-app';

  showIcon() : boolean {
    console.log('showIcon');
    return this.jwtService.isTokenValid();
  }
}
