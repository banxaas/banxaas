import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { CodeValidationComponent } from './components/register/code-validation/code-validation.component';
import { RegisterComponent } from './components/register/register.component';
import { AnnounceComponent } from './components/user/announce/announce.component';
import { BuyComponent } from './components/user/buy/buy.component';
import { HomeComponent } from './components/user/home/home.component';
import { OfferComponent } from './components/user/offer/offer.component';
import { CompteComponent } from './components/user/profil/compte/compte.component';
import { PasswordComponent } from './components/user/profil/password/password.component';
import { PaymentMethodComponent } from './components/user/profil/payment-method/payment-method.component';
import { ProfilComponent } from './components/user/profil/profil.component';
import { SecurityComponent } from './components/user/profil/security/security.component';
import { UserComponent } from './components/user/user.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'accueil', component: WelcomeComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'validation_code', component: CodeValidationComponent },
  { path: 'user', redirectTo:'user/home' },
  { path: 'acheter', component: BuyComponent },
  { path: 'annonce', component: AnnounceComponent },
  { path: 'user', component: UserComponent,
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'offre', component: OfferComponent },
        { path: 'accueil', component: WelcomeComponent },
        { path: 'profil', redirectTo:'profil/securite' },
        { path: 'profil', component: ProfilComponent,
            children: [
              { path: 'compte', component: CompteComponent },
              { path: 'securite', component: SecurityComponent },
              { path: 'mot-de-passe', component: PasswordComponent },
              { path: 'methode-paiement', component: PaymentMethodComponent },
            ]
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
