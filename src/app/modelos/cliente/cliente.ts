export class ClienteMedidor{

    ID: number;
    Name: string;
    NamespaceID: number;
    SourceTypeID: number;
    TimeZoneID: number;
    Description: string;
    Signature: string;
    DisplayName: string;

    constructor(
        ID: number,
        Name: string,
        NamespaceID: number,
        SourceTypeID: number,
        TimeZoneID: number,
        Description: string,
        Signature: string,
        DisplayName: string
    ){
        this.ID=ID;
        this.Name=Name;
        this.NamespaceID=NamespaceID;
        this.SourceTypeID=SourceTypeID;
        this.TimeZoneID=TimeZoneID;
        this.Description=Description;
        this.Signature=Signature;
        this.DisplayName=DisplayName;
    }

}