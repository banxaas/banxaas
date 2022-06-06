import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  pseudo!: string

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    console.log(this.pseudo);
  }

}
