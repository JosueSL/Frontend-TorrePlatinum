export class ConsumoModel{
    ID: number;
    Consumo: number;
    Fecha: Date;
    idTorre: number;

    constructor(ID: number, Consumo: number, Fecha: Date, idTorre: number){
        this.ID=ID;
        this.Consumo=Consumo;
        this.Fecha=Fecha;
        this.idTorre=idTorre;
    }
}