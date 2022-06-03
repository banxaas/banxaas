import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pseudo!: string | null;

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    
    // this.pseudo = this.localStorage.get('user');
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
  }

}
