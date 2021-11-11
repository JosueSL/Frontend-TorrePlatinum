export class FechaFacturaModel{

        ID: number;
        FechaInicio: Date;
        FechaFin: Date;
        FechaVencimiento: Date;
        Activo: Boolean;
        Hora: Date;

        constructor(
            ID: number,
            FechaInicio: Date,
            FechaFin: Date,
            FechaVencimiento: Date,
            Activo: Boolean,
            Hora: Date
        ){
            this.ID=ID;
            this.FechaInicio=FechaInicio;
            this.FechaFin=FechaFin;
            this.FechaVencimiento=FechaVencimiento;
            this.Activo=Activo;
            this.Hora=Hora;
        }

}