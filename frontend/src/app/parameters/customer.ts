
export interface Customer {
    
    // id?: number;
    quantityType?: string;
    quantityMin?:string;
    quantityMax?:string;
    quantityFixe?:string;
    amountType?: string;
    amountMin?:string;
    amountMax?:string;
    amountFixe?:string;
    marge?: number;
    sens?: string;
    provider?: string;
    user?: User
}

export interface User {

    pseudo?: string
    seniority?: string
}