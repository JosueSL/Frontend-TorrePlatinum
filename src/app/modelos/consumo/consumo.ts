export class ConsumoModel{
    ID: number;
    Value: number;
    SourceID: number;
    QuantityID: number;
    TimestampUTC: Date;

    constructor(
        ID: number,
        Value: number,
        SourceID: number,
        QuantityID: number,
        TimestampUTC: Date
    ){
        this.ID=ID;
        this.Value=Value;
        this.SourceID=SourceID;
        this.QuantityID=QuantityID;
        this.TimestampUTC=TimestampUTC;
    }
}

export class ConsumoEneeModel{
    ID: number;
    Consumo: number;
    Fecha: Date;
    idTorre: number;

    constructor(
        ID: number,
        Consumo: number,
        Fecha: Date,
        idTorre: number
    ){
        this.ID=ID;
        this.Consumo=Consumo;
        this.Fecha=Fecha;
        this.idTorre=idTorre;
    }
}