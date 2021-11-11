import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MesesService {

  constructor() { }
  Mes(idMes): string{
    let NombreMes: string ="";
    const meses = [
      { id: 1, mes: 'ENERO' },
      { id: 2, mes: 'FEBRERO' },
      { id: 3, mes: 'MARZO' },
      { id: 4, mes: 'ABRIL' },
      { id: 5, mes: 'MAYO' },
      { id: 6, mes: 'JUNIO' },
      { id: 7, mes: 'JULIO' },
      { id: 8, mes: 'AGOSTO' },
      { id: 9, mes: 'SEPTIEMBRE' },
      { id: 10, mes: 'OCTUBRE' },
      { id: 11, mes: 'NOVIEMBRE' },
      { id: 12, mes: 'DICIEMBRE' }
    ];

    for (let item of meses.filter(x => x.id==idMes)){
      NombreMes = item.mes;
    }

    return NombreMes;
  }
}
