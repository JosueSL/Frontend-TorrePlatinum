import { Component, OnInit } from '@angular/core';
import { ConceptoCobroService } from '../../servicios/conceptoCobro/concepto-cobro.service';
import { ConceptoModelDB } from '../../modelos/conceptoCobro/conceptoCobro';
import { FechaFacturaModel } from '../../modelos/configuracion/fechafactura';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})

export class ServicioComponent implements OnInit {

  ConceptoCobro: ConceptoModelDB[] = [];
  FechaFactura: FechaFacturaModel[] = [];
  FechaAnterior: Date = new Date();
  FechaActual: Date = new Date();
  FechaVencimiento: Date = new Date();
  Activo: Boolean;
  Hora: Date = new Date;

  constructor(private ConceptoS: ConceptoCobroService) {
    this.LimpiarData();
    this.Activo=false;
  }

  ngOnInit() {
    this.ConceptoS.GetDataConfig().subscribe(
      (data) => {
        this.FechaFactura = data[0];
        this.ConceptoCobro = data[1];

        for (let item of this.FechaFactura){
          this.Activo=item.Activo;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  AddConceptoCobro() {
    let cont = 0;
    let Data = {
      Valor: 0
    }
    for (let item of this.ConceptoCobro) {
      Data.Valor = item.Valor;
      this.ConceptoS.PostDataConcepto(Data, item.ID).subscribe(
        (res) => {
          console.log(res);
          cont++;
          if (this.ConceptoCobro.length == cont) {
            Swal.fire(
              'ACTUALIZADO',
              'Los datos de concepto de cobro se han actualizado exitosamente',
              'success'
            )
          }
        },
        (err) => {
          console.log(err);
          Swal.fire(
            'ERROR',
            'Error al actualizar datos de concepto de cobro',
            'error'
          )
        }
      );
    }
  }

  AddFechas() {

    if (this.FechaActual != null || this.FechaAnterior != null || this.FechaVencimiento != null || this.Hora != null) {
      let Data = {
        FechaInicio: null,
        FechaFin: null,
        FechaVencimiento: null,
        Hora: null
      }
      let fechaI = moment(new Date(this.FechaAnterior.toString())).add(1, 'days');
      let fechaF = moment(new Date(this.FechaActual.toString())).add(1, 'days');
      let fechaV = moment(new Date(this.FechaVencimiento.toString())).add(1, 'days');

      Data.FechaInicio = fechaI;
      Data.FechaFin = fechaF;
      Data.FechaVencimiento = fechaV;
      Data.Hora = new Date(moment().year(), moment().month(), moment().date(), parseInt((this.Hora).toString().split(':')[0]), parseInt((this.Hora).toString().split(':')[1]));

      this.ConceptoS.PatchFecha(Data).subscribe(
        (res) => {
          console.log(res);
          for (let item of this.FechaFactura) {
            item.FechaInicio = Data.FechaInicio;
            item.FechaFin = Data.FechaFin;
            item.FechaVencimiento = Data.FechaVencimiento;
            item.Hora = Data.Hora;
          }
          this.LimpiarData(); +
            Swal.fire(
              'ACTUALIZADO',
              'Los datos de las fechas para el envío de correo se han actualizado exitosamente',
              'success'
            )
        },
        (err) => {
          this.LimpiarData();
          Swal.fire(
            'ERROR',
            'Error al actualizar las fechas para envío de correo',
            'error'
          )
          console.log(err);
        }
      );
    } else {
      Swal.fire(
        'ADVERTENCIA',
        'Campos de fecha en blanco',
        'warning'
      )
    }

  }

  CalcularDatos(valor, id) {
    for (let item of this.ConceptoCobro.filter(x => x.ID == id)) {
      item.Valor = valor;
    }
  }

  ServicioActivo() {
    //alert(this.Activo);
    let Data = {
      Activo: this.Activo
    }
    let avisoERR = '',avisoSUCC= '';
    avisoERR = (this.Activo == true) ? 'Activar' : 'Desactivar';
    avisoSUCC = (this.Activo == true) ? 'Activado' : 'Desactivado';
    this.ConceptoS.PatchActivarCorreo(Data).subscribe(
      (res) => {
        console.log(res);
        Swal.fire(
          avisoSUCC,
          '....',
          'success'
        )
      },
      (err) => {
        console.log(err);
        Swal.fire(
          'ERROR',
          'Error al ' + avisoERR + ' el servicio de envío de correo',
          'error'
        )
      }
    );
  }

  LimpiarData() {
    this.FechaAnterior = null;
    this.FechaActual = null;
    this.FechaVencimiento = null;
    this.Hora = null;
  }
}
