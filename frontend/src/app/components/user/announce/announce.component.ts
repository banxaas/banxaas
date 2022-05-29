import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss']
})
export class AnnounceComponent implements OnInit {

  rangeHidden!:any;
  fixeHidden!:any;

  formSelect = new FormGroup({
    quantite: new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
  }

  hide(){
    if (this.formSelect.value.quantite === "range") {
      
      this.rangeHidden = !this.rangeHidden
      this.fixeHidden = false
    }
    if (this.formSelect.value.quantite === "fixe") {
      
      this.fixeHidden = !this.fixeHidden
      this.rangeHidden = false
    }
    
  }
}
