export class MedClienteModel{
    ID: number;
    Medidor: number;
    Cliente: string;
    Nombre: string;
    Correo: string;
    Saldo: number;
    IdTorre: number;
    Torre: string;

    constructor(ID: number, Medidor: number, Cliente: string, Nombre: string, Correo: string, Saldo: number, IdTorre: number, Torre: string){
        this.ID=ID;
        this.Medidor=Medidor;
        this.Cliente=Cliente;
        this.Nombre=Nombre;
        this.Correo=Correo;
        this.Saldo=Saldo;
        this.IdTorre=IdTorre;
        this.Torre=Torre;
    }
}

export class MedClienteModelDB{
    ID: number;
    Medidor: number;
    Cliente: string;
    Correo: string;
    Saldo: number;
    IdTorre: number;
    Torre: string;

    constructor(ID: number, Medidor: number, Cliente: string, Correo: string, Saldo: number, IdTorre: number, Torre: string){
        this.ID=ID;
        this.Medidor=Medidor;
        this.Cliente=Cliente;
        this.Correo=Correo;
        this.Saldo=Saldo;
        this.IdTorre=IdTorre;
        this.Torre=Torre;
    }
}

export class MedClienteModelDBAdd{
    Medidor: number;
    Cliente: string;
    IdTorre: number;

    constructor(Medidor: number, Cliente: string, IdTorre: number){
        this.Medidor=Medidor;
        this.Cliente=Cliente;
        this.IdTorre=IdTorre;
    }
}