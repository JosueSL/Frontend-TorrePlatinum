import { Component, ChangeDetectorRef } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfiguracionService } from '../../servicios/configuracion/configuracion.service';
import { ConsumoModel } from '../../modelos/configuracion/consumo';
import { MedClienteModel } from '../../modelos/configuracion/medidorcliente';
import { MedClienteModelDB } from '../../modelos/configuracion/medidorcliente';
import { MedClienteModelDBAdd } from '../../modelos/configuracion/medidorcliente';
import { kWhModel } from '../../modelos/kWh/kWh';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ClienteMedidor } from '../../modelos/cliente/cliente';
import { ClienteMedidorApp } from '../..//modelos/cliente/clienteApp';
import { TorreModel } from '../../modelos/torre/torre';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';

@Component({
  selector: 'app-ngbd-tabs',
  templateUrl: './configuracion.component.html'
})
export class configurationComponent {
  currentJustify = 'fill';
  ConsumoEnee: ConsumoModel[] = [];
  MedidorCliente: MedClienteModel[] = []; MedidorClienteFill: MedClienteModel[] = [];
  kWh: kWhModel[] = [];
  ClienteMedidor: ClienteMedidor[] = [];//LISTA GENERAL DE CLIENTES
  ClienteMedFil: ClienteMedidorApp[] = [];//LISTA FILTRADA DE CLIENTES POR TORRE
  Cliente_Medidor = 0;
  Cliente_Nombre: string = "";
  Busqueda: string = "";
  BusquedaMedidor: string = "";
  //DATOS TORRE
  Torre: TorreModel[] = [];
  cmbTorre = 0;
  cmbTorreFiltro = 0;

  currentOrientation = 'horizontal';
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }

  constructor(private ConfigS: ConfiguracionService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.MedidorCliente = [];
    this.MedidorClienteFill = [];
    this.ConsumoEnee = [];
    this.kWh = [];
    this.RecargarData();
  }

  FiltrarCliente() {
    let inicio, fin = 0;
    let codigo, Ncodigo = "";

    for (let fila of this.Torre.filter(x => x.ID == this.cmbTorre)) {
      inicio = fila.Inicio;
      fin = fila.Fin;
    }
    let Num = [];
    let cont: number = 0, Max: number = 0, Min: number = 0;
    let Maximo: number = 0, Minimo: number = 0;
    let tamano: number = 0, contador = 0, indicador = 0;
    let medidores = [];
    this.ClienteMedFil = [];
    for (let item of this.ClienteMedidor.filter(x => parseInt(x.Name.charAt(3)) >= inicio && parseInt(x.Name.charAt(3)) <= fin)) {
      Ncodigo = item.Name;
      tamano = 0, contador = 0, indicador = 0;
      let apartamento="";
      if (item.Name.includes('MED')){
        for (let item of Ncodigo) {
          if (contador > 2) {
            if ((medidores[0] + "" + medidores[1] + "" + medidores[2]) == "MED") {
              indicador = 1;
              tamano -= 3;
              medidores[0] = medidores[1];
              medidores[1] = medidores[2];
              medidores[2] = item;
            }else {
              medidores[0] = medidores[1];
              medidores[1] = medidores[2];
              medidores[2] = item;
            }
          } else {
            medidores[contador] = item;
          }
          if (indicador != 1) {
            tamano++;
            contador++;
          }
        }

        codigo = Ncodigo.substring(tamano, Ncodigo.length);
        Num[cont] = parseInt(item.ID.toString());
        
        apartamento = codigo;

      }else{

        for (let item of Ncodigo){
          if (item=='.'){
            tamano=contador+1;
          }else{
            contador++;
          }
        }
        
        codigo = Ncodigo.substring(tamano, Ncodigo.length);
        Num[cont] = parseInt(item.ID.toString());
        
        apartamento = codigo;
      }

      if (cont > 0) {
        Maximo = Math.max(Num[cont], Max);
        Minimo = Math.min(Num[cont], Min);
      } else {
        Max = Num[cont];
        Min = Num[cont];
      }

      this.ClienteMedFil.push(new ClienteMedidorApp(item.ID, apartamento, item.NamespaceID, item.SourceTypeID,
        item.TimeZoneID, item.Description, item.Signature, item.DisplayName, parseInt(codigo.substring(4, codigo.length))));
      cont++;
    }
    this.ClienteMedFil.sort((a, b) => { return (a.Posicion - b.Posicion) });
  }

  ActualizarConsumo(id, valor) {
    if (valor!=""){
      let fecha = new Date();
      fecha.setDate(fecha.getDate() + 1);
      let body = {
        Consumo: valor,
        Fecha: moment(fecha).format('YYYY-MM-DD').toString()
      };
  
      for (let item of this.ConsumoEnee.filter(x=>x.ID==id)) {
        item.Consumo = valor;
        item.Fecha = new Date(moment(fecha).format('YYYY-MM-DD').toString());
      }
  
      this.ConfigS.ActualizarConsumo(id, body).subscribe(
        (res) => {
          Swal.fire(
            'ACTUALIZADO',
            'El consumo general ha sido actualizado exitosamente',
            'success'
          )
        },
        (err) => {
          Swal.fire(
            'ERROR',
            'Error al actualizar el consumo',
            'error'
          )
          console.error('Error: ', err);
        }
      );
    }else{
      Swal.fire(
        'ADVERTENCIA',
        'Datos vacios',
        'warning'
      )
    }
  }

  ActualizarkWh(id, valor) {

    if (valor!=""){
      let data = {
        valor: valor
      }
  
      for (let item of this.kWh) {
        item.valor = valor;
      }
  
      this.ConfigS.ActualizarkWh(id, data).subscribe(
        (res) => {
          Swal.fire(
            'ACTUALIZADO',
            'El valor del kWh general ha sido actualizado exitosamente',
            'success'
          )
        },
        (err) => {
          Swal.fire(
            'ERROR',
            'Error al actualizar el kWh',
            'error'
          )
        }
      );
    }else{
      Swal.fire(
        'ADVERTENCIA',
        'Datos vacios',
        'warning'
      )
    }
  }

  async GuardarMedidorCliente() {
    if (this.cmbTorre != 0 || this.Cliente_Medidor != 0 || this.Cliente_Nombre != "") {
      if (this.MedidorCliente.filter(x => x.Medidor == this.Cliente_Medidor).length == 0) {
        let data: MedClienteModelDBAdd[] = [];
        data.push(new MedClienteModelDBAdd(this.Cliente_Medidor, this.Cliente_Nombre.toLowerCase(), this.cmbTorre));

        let Ncodigo: string = "", codigo: string = "", id = 0, idTorre=0, NombreTorre='';

        await this.ConfigS.AddMedidorCliente(data).subscribe(
          (Data: MedClienteModelDB[]) => {
            for (let item of Data) {
              id = item.ID;
              idTorre = item.IdTorre;
              this.Torre.filter(x=>x.ID==item.IdTorre).forEach(row => {
                NombreTorre=row.Torre;
              });
            }

            for (let row of this.ClienteMedidor.filter(x => x.ID == this.Cliente_Medidor)) {
              Ncodigo = row.Name;
            }
            codigo = Ncodigo.substring(5, Ncodigo.length);

            this.MedidorCliente.push(new MedClienteModel(id, this.Cliente_Medidor, this.Cliente_Nombre, codigo,'', 0, idTorre, NombreTorre));

            this.LimpiarDatos();

            Swal.fire(
              'AGREGADO',
              'El cliente ha sido agregado exitosamente',
              'success'
            )
          },
          (err) => {
            Swal.fire(
              'ERROR',
              'Error al agregar el cliente',
              'error'
            )
          }
        );
      } else {
        Swal.fire(
          'ADVERTENCIA',
          'Ya se le asignó un cliente al medidor',
          'warning'
        )
      }
    } else {
      Swal.fire(
        'DATOS VACIOS',
        'Favor llenar los datos',
        'warning'
      )
    }
  }

  ActualizarCliente(id, nombre, medidor, correo, saldo, placeholderName, placeholderCorreo, placeholderSaldo) {
    let name='', mail='', money=0;
    if (nombre!=''){name=nombre}else{name=placeholderName}
    if (correo!=''){mail=correo}else{mail=placeholderCorreo}
    if (saldo!=''){money=saldo}else{money=placeholderSaldo}

    let data = {
      Medidor: medidor,
      Cliente: name,
      Correo: mail,
      Saldo: money
    }
    this.ConfigS.UpdateMedidorCliente(id, data).subscribe(
      (res) => {
        for (let item of this.MedidorCliente.filter(x => x.ID == id)) {
          item.Cliente = data.Cliente;
          item.Correo = data.Correo;
          item.Saldo = data.Saldo;
        }
        Swal.fire(
          'ACTUALIZADO',
          'El cliente ha sido actualizado exitosamente',
          'success'
        )
      },
      (err) => {
        Swal.fire(
          'ERROR',
          'Error al actualizar el cliente',
          'error'
        )
      }
    );
  }

  BuscarCliente(){
    if (this.MedidorCliente.filter(x=>x.Medidor==this.Cliente_Medidor).length==1){
      this.MedidorCliente.filter(x=>x.Medidor==this.Cliente_Medidor).forEach(item => {
        this.Cliente_Nombre = item.Cliente;
      });
    }else{
      this.Cliente_Nombre='';
    }
  }

  FilterTabla() {
    let ArrayTemp: MedClienteModel[] = [];
    if (this.cmbTorreFiltro==0){
      ArrayTemp = this.MedidorClienteFill;   
      this.MedidorCliente = ArrayTemp.filter(x => x.Cliente.includes(this.Busqueda));
    }else{
      ArrayTemp = this.MedidorClienteFill;   
      this.MedidorCliente = ArrayTemp.filter(x => x.Cliente.includes(this.Busqueda) && x.IdTorre==this.cmbTorreFiltro);
    }
    //this.cd.detectChanges();
  }

  FilterTablaByTorre() {
    let ArrayTemp: MedClienteModel[] = [];
    if (this.cmbTorreFiltro!=0){
      ArrayTemp = this.MedidorClienteFill;   
      this.MedidorCliente = ArrayTemp.filter(x => x.IdTorre==this.cmbTorreFiltro);
    }else{
      ArrayTemp = this.MedidorClienteFill;   
      this.MedidorCliente = ArrayTemp;
    }
  }

  RecargarData() {
    this.ConfigS.ObtenerDatos().subscribe(
      (Data) => {
        this.MedidorCliente = Data[0];
        this.MedidorClienteFill = Data[0];
        this.ConsumoEnee = Data[1];
        this.kWh = Data[2];

        let Ncodigo: string = "", codigo: string = "";
        let tamano: number = 0, contador = 0, indicador = 0;
        let medidores = [];

        for (let item of Data[3]) {
          if (item.Name.includes('EGX') != -1) {
            this.ClienteMedidor.push(new ClienteMedidor(item.ID, item.Name, item.NamespaceID,
              item.SourceTypeID, item.TimeZoneID, item.Description, item.Signature, item.DisplayName));
          }
          
          Ncodigo = item.Name;
          tamano = 0, contador = 0, indicador = 0;
          let apartamento="";
          if (item.Name.includes('MED')){
            for (let item of Ncodigo) {
              if (contador > 2) {
                if ((medidores[0] + "" + medidores[1] + "" + medidores[2]) == "MED") {
                  indicador = 1;
                  tamano -= 3;
                  medidores[0] = medidores[1];
                  medidores[1] = medidores[2];
                  medidores[2] = item;
                }else {
                  medidores[0] = medidores[1];
                  medidores[1] = medidores[2];
                  medidores[2] = item;
                }
              } else {
                medidores[contador] = item;
              }
              if (indicador != 1) {
                tamano++;
                contador++;
              }
            }
    
            codigo = Ncodigo.substring(tamano, Ncodigo.length);
            
            apartamento = codigo;
    
          }else{
    
            for (let item of Ncodigo){
              if (item=='.'){
                tamano=contador+1;
              }else{
                contador++;
              }
            }
            
            codigo = Ncodigo.substring(tamano, Ncodigo.length);
            apartamento = codigo;
          }

          for (let row of this.MedidorCliente.filter(x => x.Medidor == item.ID)) {
            row.Nombre = apartamento;
          }

        }

        this.Torre = Data[4];
        for (let item of this.MedidorCliente){
            this.Torre.filter(x=>x.ID==item.IdTorre).forEach(row => {
                item.Torre=row.Torre;
            });
        }
      },
      (err) => {
        console.error('error', err);
      }
    );
  }

  NomreTorre(idTorre): string {
    let torre: string;
      for (let item of this.Torre.filter(x => x.ID == idTorre)){
        torre = item.Torre;
      }
    return torre;
  }

  LimpiarDatos(){
    this.cmbTorre=0;
    this.Cliente_Medidor=0;
    this.Cliente_Nombre="";
  }
}
