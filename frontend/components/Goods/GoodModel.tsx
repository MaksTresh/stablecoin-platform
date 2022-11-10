class GoodModel {
    constructor(name : string, rate : number, price : number, desc: string, balance: number, change : string) {
        this.name = name;
        this.rate = rate;
        this.price = price;
        this.desc = desc;
        this.balance = balance;
        this.change = change;
    }
    
    name : string = "Росатом";
    rate : number = 1;
    price : number = 100;
    desc : string = "A";
    balance : number = 3.2;
    change : string = "+500.2 Р, +23% за всё время";
}

export default GoodModel;