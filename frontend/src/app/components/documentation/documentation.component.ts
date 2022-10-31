import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  intro!: Boolean;
  btc!: Boolean;
  diff!: Boolean;
  buy!: Boolean;
  sell!: Boolean;
  publish!: Boolean;
  blockchain!: Boolean;
  minage!: Boolean;
  pow!: Boolean;
  bgIntro!: string;
  bgDiff!: string;
  bgBtc!: string;
  bgBuy!: string;
  bgSell!: string;
  bgPublish!: string;
  bgBlockchain!: string;
  bgMinage!: string;
  bgPow!: string;

  constructor() { }

  ngOnInit(): void {


    this.intro = true;
    this.btc = false;
    this.diff = false;
    this.buy = false;
    this.sell = false;
    this.publish = false;
    this.blockchain = false;
    this.minage = false;
    this.pow = false;
  }

  hide(val : string){
    if (val === 'intro') {
      this.intro = true;
      this.btc = false;
      this.diff = false;
      this.buy = false;
      this.sell = false;
      this.publish = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'bitcoin') {
      this.btc = true;
      this.intro = false;
      this.diff = false;
      this.buy = false;
      this.sell = false;
      this.publish = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'difference') {
      this.diff = true;
      this.btc = false;
      this.intro = false;
      this.buy = false;
      this.sell = false;
      this.publish = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'acheter') {
      this.buy = true;
      this.diff = false;
      this.btc = false;
      this.intro = false;
      this.sell = false;
      this.publish = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'vendre') {
      this.sell = true;
      this.buy = false;
      this.diff = false;
      this.btc = false;
      this.intro = false;
      this.publish = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'publier') {
      this.publish = true;
      this.sell = false;
      this.buy = false;
      this.diff = false;
      this.btc = false;
      this.intro = false;
      this.blockchain = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'blockchain') {
      this.blockchain = true;
      this.publish = false;
      this.sell = false;
      this.buy = false;
      this.diff = false;
      this.btc = false;
      this.intro = false;
      this.minage = false;
      this.pow = false;
    }
    if (val === 'minage') {
      this.minage = true;
      this.blockchain = false;
      this.publish = false;
      this.sell = false;
      this.buy = false;
      this.diff = false;
      this.btc = false;
      this.intro = false;
      this.pow = false;
    }
    if (val === 'pow') {
      this.pow = true;
      this.minage = false;
      this.blockchain = false;
      this.publish = false;
      this.sell = false;
      this.buy = false;
      this.diff = false;
      this.btc = false;
      this.intro = false;
    }
  }


  changeBg(value:string){
    if (value==='intro') {
      this.bgIntro = "background-color: #dcfce7;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='btc') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: #dcfce7; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='diff') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: #dcfce7; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='buy') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: #dcfce7; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='sell') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: #dcfce7; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='publish') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: #dcfce7; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='blockchain') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: #dcfce7; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: white; "
    }
    if (value==='minage') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: #dcfce7; "
      this.bgPow = "background-color: white; "
    }
    if (value==='pow') {
      this.bgIntro = "background-color: white;"
      this.bgBtc = "background-color: white; "
      this.bgDiff = "background-color: white; "
      this.bgBuy = "background-color: white; "
      this.bgSell = "background-color: white; "
      this.bgPublish = "background-color: white; "
      this.bgBlockchain = "background-color: white; "
      this.bgMinage = "background-color: white; "
      this.bgPow = "background-color: #dcfce7; "
    }
  }

}
