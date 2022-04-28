import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  fieldTextType: boolean = false;
  changeText: boolean = false;

  constructor() { }

  ngOnInit(): void {  
    
    
  }

  toggleFieldTextType() {
    
    this.fieldTextType = !this.fieldTextType;
  }

}
