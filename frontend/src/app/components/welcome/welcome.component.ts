import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  host: {
    'class': 'min-h-screen flex flex-col'
  }
})
export class WelcomeComponent implements OnInit {

  constructor(private localStorage: LocalStorageService ) { }

  ngOnInit(): void {
    this.localStorage.clear()
  }

}
