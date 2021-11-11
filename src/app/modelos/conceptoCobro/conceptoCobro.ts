export class ConceptoModel{
    id: number;
    concepto: string;
    valor: number;

    constructor(id: number, concepto: string, valor: number){
        this.id=id;
        this.concepto=concepto;
        this.valor=valor;
    }
}

export class ConceptoModelDB{
    ID: number;
    Descripcion: string;
    Valor: number;

    constructor(ID: number, Descripcion: string, Valor: number){
        this.ID=ID;
        this.Descripcion=Descripcion;
        this.Valor=Valor;
    }
}