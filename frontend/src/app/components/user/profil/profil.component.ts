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

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    console.log(this.pseudo);
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
