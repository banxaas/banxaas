import {Component} from '@angular/core';
import { LocalStorageService } from 'app/parameters/local-storage.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html'
})

export class UserDropdownComponent {
  datatauser: any;
  pseudo: any;
  email: any;
  constructor(
    private localStorage: LocalStorageService,
  ) {

    this.localStorage.get('data').subscribe(
      data => {
        this.datatauser = JSON.parse(data);
        if (this.datatauser) {
          this.pseudo = this.datatauser.user.pseudo;
          this.email = this.datatauser.user.email;
        }
      }
    )
  }
}
