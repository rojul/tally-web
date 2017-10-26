class MinMax {
    min: number;
    max: number;
}

export class Config {
    recharge: number[];
    userNameLength: MinMax;
    productNameLengthMax: number;
    transactionValue: MinMax;
    transactionsLimit: number;
    title: string;
    theme: string;
    transactionMaxValue: number;
    funChanceToWin: number;
}
