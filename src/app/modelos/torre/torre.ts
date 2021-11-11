export class TorreModel{
    ID: number;
    Torre: string;
    Inicio: number;
    Fin: number;

    constructor(
        ID: number,
        Torre: string,
        Inicio: number,
        Fin: number
    ){
        this.ID=ID;
        this.Torre=Torre;
        this.Inicio=Inicio;
        this.Fin=Fin;
    }
}