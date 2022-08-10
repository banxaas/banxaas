import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { CodeValidationComponent } from './components/register/code-validation/code-validation.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/user/home/home.component';
import { ProfilComponent } from './components/user/profil/profil.component';
import { CompteComponent } from './components/user/profil/compte/compte.component';
import { PasswordComponent } from './components/user/profil/password/password.component';
import { PaymentMethodComponent } from './components/user/profil/payment-method/payment-method.component';
import { SecurityComponent } from './components/user/profil/security/security.component';
import { BuyComponent } from './components/user/buy/buy.component';
import { AnnounceComponent } from './components/user/announce/announce.component';
import { OfferComponent } from './components/user/offer/offer.component';


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {DropdownModule} from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from "primeng/tooltip";
import { CustomerService } from './parameters/customerservice';
import { MessageService } from 'primeng/api';
import { TransactionComponent } from './components/user/transaction/transaction.component';
import { AchatComponent } from './components/user/transaction/achat/achat.component';
import { VenteComponent } from './components/user/transaction/vente/vente.component';
import { AchateurComponent } from './components/user/transaction/achat/achateur/achateur.component';
import { Achateur1Component } from './components/user/transaction/vente/achateur1/achateur1.component';
import { FooterComponent } from './components/footer/footer.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { IntroductionComponent } from './components/documentation/introduction/introduction.component';
import { BitcoinComponent } from './components/documentation/bitcoin/bitcoin.component';
import { BlockchainComponent } from './components/documentation/blockchain/blockchain.component';
import { DifferenceBetweenBtcAndOtherCryptoComponent } from './components/documentation/difference-between-btc-and-other-crypto/difference-between-btc-and-other-crypto.component';
import { HowBuyComponent } from './components/documentation/how-buy/how-buy.component';
import { HowSellComponent } from './components/documentation/how-sell/how-sell.component';
import { HowPublishComponent } from './components/documentation/how-publish/how-publish.component';
import { MinageComponent } from './components/documentation/minage/minage.component';
import { PowComponent } from './components/documentation/pow/pow.component';
import { HelpComponent } from './components/help/help.component';
import { HistoryTradeComponent } from './components/user/history-trade/history-trade.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VendeurComponent } from './components/user/transaction/achat/vendeur/vendeur.component';
import { Vendeur1Component } from './components/user/transaction/vente/vendeur1/vendeur1.component';
import { WebsocketService } from './parameters/websocket.service';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RegisterComponent,
    ConnexionComponent,
    CodeValidationComponent,
    UserComponent,
    HomeComponent,
    ProfilComponent,
    CompteComponent,
    PasswordComponent,
    PaymentMethodComponent,
    SecurityComponent,
    BuyComponent,
    AnnounceComponent,
    OfferComponent,
    AnnounceComponent,
    TransactionComponent,
    AchatComponent,
    VenteComponent,
    AchateurComponent,
    VendeurComponent,
    VenteComponent,
    Achateur1Component,
    Vendeur1Component,
    FooterComponent,
    DocumentationComponent,
    IntroductionComponent,
    BitcoinComponent,
    BlockchainComponent,
    DifferenceBetweenBtcAndOtherCryptoComponent,
    HowBuyComponent,
    HowSellComponent,
    HowPublishComponent,
    MinageComponent,
    PowComponent,
    HelpComponent,
    HistoryTradeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
    StepsModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    TooltipModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CustomerService, MessageService, WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
