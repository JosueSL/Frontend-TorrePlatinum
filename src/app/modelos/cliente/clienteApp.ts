export class ClienteMedidorApp{

    ID: number;
    Name: string;
    NamespaceID: number;
    SourceTypeID: number;
    TimeZoneID: number;
    Description: string;
    Signature: string;
    DisplayName: string;
    Posicion: number;

    constructor(
        ID: number,
        Name: string,
        NamespaceID: number,
        SourceTypeID: number,
        TimeZoneID: number,
        Description: string,
        Signature: string,
        DisplayName: string,
        Posicion: number
    ){
        this.ID=ID;
        this.Name=Name;
        this.NamespaceID=NamespaceID;
        this.SourceTypeID=SourceTypeID;
        this.TimeZoneID=TimeZoneID;
        this.Description=Description;
        this.Signature=Signature;
        this.DisplayName=DisplayName;
        this.Posicion=Posicion;
    }

}