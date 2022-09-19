import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  pseudo!: string
  bgAccount!: string
  bgSecure!: string
  bgPassword!: string
  bgPayment!: string
  datauser: any

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.localStorage.get('data').subscribe(
      data => {
        this.datauser = JSON.parse(data)
        this.pseudo = this.datauser.user.pseudo;

      }
    );
  }

  changeBg(value:string){
    if (value==='compte') {
      this.bgAccount = "background-color: #008137; color:white"
      this.bgSecure = "background-color: white; color:black"
      this.bgPassword = "background-color: white; color:black"
      this.bgPayment = "background-color: white; color:black"
    }
    if (value==='securité') {
      this.bgAccount = "background-color: white; color:black"
      this.bgSecure = "background-color: #008137; color:white"
      this.bgPassword = "background-color: white; color:black"
      this.bgPayment = "background-color: white; color:black"
    }
    if (value==='password') {
      this.bgAccount = "background-color: white; color:black"
      this.bgSecure = "background-color: white; color:black"
      this.bgPassword = "background-color: #008137; color:white"
      this.bgPayment = "background-color: white; color:black"
    }
    if (value==='payment') {
      this.bgAccount = "background-color: white; color:black"
      this.bgSecure = "background-color: white; color:black"
      this.bgPassword = "background-color: white; color:black"
      this.bgPayment = "background-color: #008137; color:white"
    }
  }

}
