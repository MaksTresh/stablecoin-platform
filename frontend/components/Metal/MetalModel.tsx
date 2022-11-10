class MetalModel {
    constructor(name : string, balance : number, change : string) {
        this.name = name;
        this.balance = balance;
        this.change = change;
    }
    
    name : string = "Золото";
    balance : number = 3.2;
    change : string = "+500.2 Р, +23% за всё время";
}

export default MetalModel;