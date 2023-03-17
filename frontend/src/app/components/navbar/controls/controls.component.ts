import { Component } from '@angular/core';
import { LocalStorageService } from 'app/parameters/local-storage.service';

@Component({
  selector: '[app-navbar-controls]',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class NavbarControlsComponent {
  token: any;
  datatauser: any;

  constructor(private localStorage: LocalStorageService) {
    this.localStorage.get('data').subscribe((data) => {
      this.datatauser = JSON.parse(data);
      if (this.datatauser) {
        this.token = this.datatauser.token;
      }
    });
  }
}
