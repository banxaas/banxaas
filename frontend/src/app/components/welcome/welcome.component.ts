import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private localStorage: LocalStorageService ) { }

  ngOnInit(): void {
    this.localStorage.clear()
  }

}
