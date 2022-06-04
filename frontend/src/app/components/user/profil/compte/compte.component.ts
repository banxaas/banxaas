import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {

  errorMessage!: string
  pseudo!: string
  fieldPhone!: boolean;
  fieldEmail!: boolean;
  fieldPhone1!: boolean;
  fieldEmail1!: boolean;

  formCompte = new FormGroup({
    id: new FormControl(),
    pseudo: new FormControl(),
    email: new FormControl(),
    phone: new FormControl()
  })

  constructor(
    private localStorage: LocalStorageService,
    private customeService: CustomerService
  ) { }

  ngOnInit(): void {
    
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    this.pseudo = data.user.pseudo;
    if (data.user.phone == null) {
      this.fieldPhone = true
    }else{
      this.fieldPhone1 = true
    }
    if (data.user.email == null) {
      this.fieldEmail = true
    }else{
      this.fieldEmail1 = true
    }
  }

  setUser(){
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    const dataForm = this.formCompte.value;
    dataForm.id = data.user.pseudo
    this.customeService.setUserAccount(dataForm).subscribe(
      response => {
        console.log(response);
        
        const status = response.status
        if (status === "SUCCESSFUL") {
          this.errorMessage = "Modification réussie";
          this.localStorage.set('user',dataForm.pseudo);
          data.user.pseudo = dataForm.pseudo;
          data.user.phone = dataForm.phone;
          data.user.email = dataForm.email;

          console.log(this.localStorage.get('data'));
          
        }
        else{
          this.errorMessage = "Erreur";

        }
      },
      erreur => {
        this.errorMessage = "Erreur venant au niveau du Serveur";
        console.log(erreur);
        
      }
    );
  }

}
 