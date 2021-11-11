export class ILogin{
    usuario: string;
    contrasena: string;
}


export class LoginModel{
    ID: number;
    usuario: string;
    contrasena: string;
    idTipo: number;

    constructor(
        ID: number,
        usuario: string,
        contrasena: string,
        idTipo: number
    ){
        this.ID=ID;
        this.usuario=usuario;
        this.contrasena=contrasena;
        this.idTipo=idTipo;
    }
}