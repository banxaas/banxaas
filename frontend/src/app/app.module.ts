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
    SecurityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxMaskModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
