
export interface Customer {
    
    id?: number;
    quantite_type?: string;
    quantite_min?:number;
    quantite_max?:number;
    quantite_fixe?:number;
    montant_type?: string;
    montant_min?:number;
    montant_max?:number;
    montant_fixe?:number;
    marge?: number;
    sens?: string;
    paiement?: string;
    anciennete?: string
}