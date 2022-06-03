import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  pseudo!: string | null;

  isListProfil:any;
  isListDevise:any;

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
  }

}
