import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { CustomerService } from 'src/app/parameters/customerservice';
import { LocalStorageService } from 'src/app/parameters/local-storage.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  name!: string
  fieldActive!: boolean;
  hidden!: boolean;

  paymentForm = new FormGroup({
    token: new FormControl('', [Validators.required]),
    signature: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^(77|78|75|70|76)[0-9]{7}$')]),
  })
  deletePaymentForm = new FormGroup({
    token: new FormControl(),
    signature: new FormControl(),
    id: new FormControl()
  })
  payment!: [];
  phone: any;
  datas: any
  errorMessage: any;

  constructor(
    private localStorage: LocalStorageService,
    private customerService: CustomerService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    
    this.primengConfig.ripple = true;
    const datauser:any = this.localStorage.get('paymentMethods');
    let data = JSON.parse(datauser);
    console.log(typeof(data));
    console.log(data);
    
        
    if (data.length == 0) {
      console.log("test");
      
      this.fieldActive = false
    }
    if (data.length > 0) {
      this.datas = data
    }
  }
  
  toggleModal(){
    this.hidden = true;
  }

  get formControls(){
    
    return this.paymentForm.controls;
  }

  setPaymentMethod(){

    
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    const dataForm = this.paymentForm.value;
    dataForm.token = data.token;
    dataForm.signature = data.signature;
    this.customerService.addPaymentMethod(dataForm).subscribe(
      response => {
        console.log(dataForm);
        console.log(response);
        const status = response.status
        if (status === "SUCCESSFUL") {
          const payment:any = this.localStorage.get('paymentMethods')
          let method = JSON.parse(payment)
          
          method.push(response.paymentMethod)
          console.log(method);
          
          this.localStorage.set('paymentMethods', JSON.stringify(method) );
          // this.router.navigate(['methode-paiement'])
        }
        // {status: 'FAILED', message: 'Payment Method already exists!'}
        if (status === 'FAILED' && response.message ==='Payment Method already exists!') {
            this.errorMessage = response.message
        }
        
      }
    )

  }

  deletePayment(id:number){
    const datauser:any = this.localStorage.get('data');
    const data = JSON.parse(datauser);
    const dataForm = this.deletePaymentForm.value;
    dataForm.token = data.token;
    dataForm.signature = data.signature;
    dataForm.id = id;
    
    

    console.log(dataForm);
    
    this.customerService.deletePaymentMethod(dataForm).subscribe(
      response => {
        console.log(response);
        const status = response.status
        
      }
    )
  }

}
