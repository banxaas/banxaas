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
import {MatStepperModule} from '@angular/material/stepper';

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
import { CustomerService } from './parameters/customerservice';
import { MessageService } from 'primeng/api';
import { TransactionComponent } from './components/user/transaction/transaction.component';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatStepperModule,
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
    NgxMaskModule.forRoot()
  ],
  providers: [
    CustomerService, MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
