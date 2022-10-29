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
import { AchatComponent } from './components/user/transaction/achat/achat.component';
import { TransactionComponent } from './components/user/transaction/transaction.component';
import { VenteComponent } from './components/user/transaction/vente/vente.component';
import { UserComponent } from './components/user/user.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { IntroductionComponent } from './components/documentation/introduction/introduction.component';
import { BitcoinComponent } from './components/documentation/bitcoin/bitcoin.component';
import { DifferenceBetweenBtcAndOtherCryptoComponent } from './components/documentation/difference-between-btc-and-other-crypto/difference-between-btc-and-other-crypto.component';
import { HowBuyComponent } from './components/documentation/how-buy/how-buy.component';
import { HowSellComponent } from './components/documentation/how-sell/how-sell.component';
import { HowPublishComponent } from './components/documentation/how-publish/how-publish.component';
import { BlockchainComponent } from './components/documentation/blockchain/blockchain.component';
import { MinageComponent } from './components/documentation/minage/minage.component';
import { PowComponent } from './components/documentation/pow/pow.component';
import { HelpComponent } from './components/help/help.component';
import { HistoryTradeComponent } from './components/user/history-trade/history-trade.component';

const routes: Routes = [
  { path: 'accueil', component: WelcomeComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'documentation', redirectTo:'documentation/introduction' },
  { path: 'documentation', component: DocumentationComponent,
      children: [
        { path: 'introduction', component: IntroductionComponent },
        { path: 'qu_est_ce_que_le_bitcoin', component: BitcoinComponent },
        { path: 'difference_entre_bitcoin_et_les_autres_cryptomonnaies', component: DifferenceBetweenBtcAndOtherCryptoComponent },
        { path: 'comment_acheter', component: HowBuyComponent },
        { path: 'comment_vendre', component: HowSellComponent },
        { path: 'comment_publier', component: HowPublishComponent },
        { path: 'blockchain', component: BlockchainComponent },
        { path: 'minage', component: MinageComponent },
        { path: 'pow', component: PowComponent },
      ]

  },
  { path: 'aide_et_support', component: HelpComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'validation_code', component: CodeValidationComponent },
  { path: 'user', redirectTo:'user/home' },
  { path: 'acheter', component: BuyComponent },
  { path: 'annonce', component: AnnounceComponent },
  { path: 'user', component: UserComponent,
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'historique_transactions', component: HistoryTradeComponent },
        { path: 'transaction', component: TransactionComponent,
            children: [
              { path: 'acheteur', component: AchatComponent },
              { path: 'vendeur', component: VenteComponent },
            ]
        },
        { path: 'offre', component: OfferComponent },
        { path: 'profil', redirectTo:'profil/compte' },
        { path: 'profil', component: ProfilComponent,
            children: [
              { path: 'profil', component: HomeComponent },
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
