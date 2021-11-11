
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ClientesService } from '../servicios/clientes/clientes.service';
import { ClienteMedidor } from '../modelos/cliente/cliente';
import { ClienteMedidorApp } from '../modelos/cliente/clienteApp';
import { TorreModel } from '../modelos/torre/torre';
import { MesesService } from '../servicios/meses/meses.service';
import { ConsumoService } from '../servicios/consumo/consumo.service';
import { ConsumoModel } from '../modelos/consumo/consumo';
import { ConsumoEneeModel } from '../modelos/consumo/consumo';
import { Meses } from '../modelos/meses/meses';
import { ConceptoModel } from '../modelos/conceptoCobro/conceptoCobro';
import { ConceptoCobroService } from '../servicios/conceptoCobro/concepto-cobro.service';
import { VacioModel } from '../modelos/vacios/vacios';
import Swal from 'sweetalert2';
import { MedClienteModel } from '../modelos/configuracion/medidorcliente';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClienteListaModel } from '../modelos/clientelista/clientelista';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
  hoveredDate: NgbDate;
  FechaActual: Date;
  FechaInicio: NgbDate; FechaFormatI: string = "";
  FechaFinal: NgbDate; FechaFormatF: string = "";
  Fecha_Vencimiento: NgbDate;
  dias_facturados = 0;
  numero_factura = "";
  LPS: number = 0.0;
  Multiplicador = 0.00;
  HistoricoInicioFechaI: any[] = [];
  HistoricoInicioFechaF: any[] = [];
  HistoricoFinalFechaI: any[] = [];
  HistoricoFinalFechaF: any[] = [];
  ConsumoHistorico: any[] = [];
  Meses: number[] = [];
  MesesNombre = Meses;
  DatosNotNull: ConsumoModel[] = [];
  ConsumoTorreEnee: ConsumoEneeModel[] = [];
  FechaInicial: any;
  ListaNulos: VacioModel[] = [];
  ListaVacios: VacioModel[] = [];
  Nulos = false;
  ConceptoCobroLps: ConceptoModel[] = [];
  TotalFactura: number = 0.0;
  SaldoPendiente: number = 0.0;
  idUsuario: string;
  ListaCliente: ClienteListaModel[] = [];
  IsHeader: boolean;
  Hojas: number = 0;
  ArrayHojas: any[] = [];
  contCliente = 0;
  contClienteLimit = 0;
  dropdownSettings = {};
  indicadorPDF = 0;
  NombreTorre = "...";
  //Initialize JSPDF
  doc = new jsPDF("p", "mm", "letter");

  //DATOS TORRE
  Torre: TorreModel[] = [];
  cmbTorre = 0;
  MedI: number = 0;
  MedF: number = 0;
  TCT: ClienteMedidor[] = [];;
  Torre_Total: number = 0;

  //DATOS DE CLIENTE
  ClienteMedidor: ClienteMedidor[] = [];//LISTA GENERAL DE CLIENTES
  ClienteMedFil: ClienteMedidorApp[] = [];//LISTA FILTRADA DE CLIENTES POR TORRE
  Cliente_Nombre: string = "";
  Cliente_Medidor: number = 0;
  Cliente_Codigo: string = "-";
  Cliente_N_Medidor: string = "-";
  Fecha1: string = "";
  Fecha2: string = "";
  Fecha1_Anterior: string = "";
  Cliente_ConsumoI: ConsumoModel[] = [];
  Cliente_ConsumoF: ConsumoModel[] = [];
  Cliente_Consumo1: any = 0;
  Cliente_Consumo2: any = 0;
  ClienteConsumoTotal: number = 0.00;
  MedidorCliente: MedClienteModel[] = [];

  //ENEE CONSUMO - 483.45 - MED_414 Total - 6884.98
  Enee_Consumo: number = 0;
  Enee_Fecha: Date;

  //GRAFICO
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    showTooltips: true
  };

  public barChartLabels: any[] = [' - ', ' - ', ' - ', ' - ', ' - ', ' - '];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [{
    data: [0, 0, 0, 0, 0, this.ClienteConsumoTotal],
    label: 'CONSUMO'
  }];

  public barChartColors: Array<any> = [{
    backgroundColor: '#1E90FF',
    borderColor: '#00BFFF'
  }];

  currentOrientation = 'horizontal';
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }

  constructor(
    private Modal: NgbModal,
    private Calendario: NgbCalendar,
    private ClienteS: ClientesService,
    private ConsumoS: ConsumoService,
    private cd: ChangeDetectorRef,
    private CClps: ConceptoCobroService) {

    this.FechaInicio = this.Calendario.getToday();
    this.FechaFinal = this.Calendario.getToday();
    this.Fecha_Vencimiento = this.Calendario.getToday();
    this.FechaActual = new Date();
    //this.FechaFinal = Calendario.getNext(Calendari+-o.getToday(), 'd', 10);
    //this.ClienteMedidor.push(new ClienteMedidor(0,"",0,0,0,"","",""));
  }

  ngOnInit() {
    this.IsHeader = false;
    this.setSelectedPeople3();
    this.idUsuario = localStorage.getItem('token');
    this.ConceptoCobroLps = this.CClps.ListaConcepto;
    this.CargarDatosGenerales();
  }

  CargarDatosGenerales() {
    this.ClienteS.ClienteTorre().subscribe(
      (Data) => {
        /*for (let item of Data[2]) {
          this.Enee_Consumo = item.Consumo;
          this.Enee_Fecha = item.Fecha;
        }*/
        this.ConsumoTorreEnee = Data[2];
        //DATOS DE CODIGO DE CLIENTE
        this.TCT = Data[0];
        //let egx = 0;

        this.Torre = Data[1];

        for (let item of Data[0]) {
          //if (item.Name.indexOf('MED') != -1)

          //egx = parseInt(item.Name.substring(3, 4));
          //this.MedF = Data[0].filter(x=> x.Inicio >= egx && x.Fin <= egx).length;  
          //this.MedF = Data[0].length;

          if (item.Name.indexOf('EGX') != -1) {
            this.ClienteMedidor.push(new ClienteMedidor(item.ID, item.Name, item.NamespaceID,
              item.SourceTypeID, item.TimeZoneID, item.Description, item.Signature, item.DisplayName));
          }
        }

        //DATOS TORRE


        //DATO DEL VALOR DEL kWh
        for (let item of Data[3]) {
          this.LPS = item.valor;
        }

        this.MedidorCliente = Data[4];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ObtenerCodigo(id) {

    for (let item of this.ClienteMedFil.filter(x => x.ID == id)) {

      this.Cliente_Codigo = "MED_" + item.Name.substring(12, item.Name.length);
      this.Cliente_N_Medidor = item.Name.substring(12, item.Name.length);

    }

    /*for (let item of this.ClienteMedFil.filter(x => x.ID == id)) {
      if (isNumber(item.Name.substring(12, item.Name.length))==true){
        this.Cliente_Codigo = "MED_" + item.Name.substring(12, item.Name.length);
        this.Cliente_N_Medidor = item.Name.substring(12, item.Name.length);
      }else{
        this.Cliente_Codigo = "MED_0";
        this.Cliente_N_Medidor = "0";
      }
    }*/

    if (this.MedidorCliente.filter(x => x.Medidor == id).length == 1) {
      for (let item of this.MedidorCliente.filter(x => x.Medidor == id)) {
        this.Cliente_Nombre = item.Cliente;
      }
    } else {
      this.Cliente_Nombre = "";
    }
  }

  FiltrarCliente() {
    let inicio, fin = 0;
    let codigo, Ncodigo = "";

    if (this.cmbTorre != 0) {
      for (let fila of this.Torre.filter(x => x.ID == this.cmbTorre)) {
        this.NombreTorre = fila.Torre;
        inicio = fila.Inicio;
        fin = fila.Fin;
      }
    } else {
      this.NombreTorre = "...";
    }

    let Num = [];
    let cont: number = 0, Max: number = 0, Min: number = 0;
    let Maximo: number = 0, Minimo: number = 0;
    let tamano: number = 0, contador = 0, indicador = 0;
    let medidores = [];
    this.ClienteMedFil = [];
    for (let item of this.ClienteMedidor.filter(x => parseInt(x.Name.charAt(3)) >= inicio && parseInt(x.Name.charAt(3)) <= fin)) {
      //this.MedF = this.ClienteMedidor.filter(x => parseInt(x.Name.charAt(3)) >= inicio && parseInt(x.Name.charAt(3)) <= fin).length;
      Ncodigo = item.Name;
      tamano = 0, contador = 0, indicador = 0;
      let apartamento = "";
      if (item.Name.includes('MED')) {
        for (let item of Ncodigo) {
          if (contador > 2) {
            if ((medidores[0] + "" + medidores[1] + "" + medidores[2]) == "MED") {
              indicador = 1;
              tamano -= 3;
              medidores[0] = medidores[1];
              medidores[1] = medidores[2];
              medidores[2] = item;
            } else {
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

        apartamento = "Apartamento " + codigo.substring(4, codigo.length);

      } else {

        for (let item of Ncodigo) {
          if (item == '.') {
            tamano = contador + 1;
          } else {
            contador++;
          }
        }

        codigo = Ncodigo.substring(tamano, Ncodigo.length);
        Num[cont] = parseInt(item.ID.toString());

        apartamento = codigo;
      }

      if (cont > 0) {
        if (Max < Num[cont]) {
          Maximo = Num[cont];
          Max = Num[cont];
        } else {
          Maximo = Max;
          Max = Max;
        }

        if (Min > Num[cont]) {
          Minimo = Num[cont];
          Min = Num[cont];
        } else {
          Minimo = Min;
          Minimo = Min;
        }
        //Maximo = Math.max(Num[cont], Max);
        //Minimo = Math.min(Num[cont], Min);
      } else {
        Max = Num[cont];
        Min = Num[cont];
      }

      this.ClienteMedFil.push(new ClienteMedidorApp(item.ID, apartamento, item.NamespaceID, item.SourceTypeID,
        item.TimeZoneID, item.Description, item.Signature, item.DisplayName, parseInt(codigo.substring(4, codigo.length))));

      cont++;
    }
    this.MedF = Maximo;
    this.MedI = Minimo;
    this.ClienteMedFil.sort((a, b) => { return (a.Posicion - b.Posicion) });

    for (let item of this.ConsumoTorreEnee.filter(x => x.idTorre == this.cmbTorre)) {
      this.Enee_Consumo = item.Consumo;
      this.Enee_Fecha = item.Fecha;
    }
    //alert(this.Enee_Consumo+" - "+this.Enee_Fecha);
    /*for (let item of Data[2]) {
      this.Enee_Consumo = item.Consumo;
      this.Enee_Fecha = item.Fecha;
    }*/

  }

  async generatePdf() {
    const div = await document.getElementById("impresion");
    const options = {
      background: "white",
      height: div.clientHeight,
      width: div.clientWidth,
      scale: 2
    };

    html2canvas(div, options).then(async (canvas) => {
      var context = canvas.getContext("2d");
      context.scale(2, 2);
      context["imageSmoothingEnabled"] = false;
      context["mozImageSmoothingEnabled"] = false
      context["oImageSmoothingEnabled"] = false
      context["webkitImageSmoothingEnabled"] = false
      context["msImageSmoothingEnabled"] = false

      //Converting canvas to Image
      let imgData = await canvas.toDataURL("image/JPEG", 1.0);
      let width = this.doc.internal.pageSize.width;
      let height = this.doc.internal.pageSize.height;
      //Add image Canvas to PDF 
      this.ArrayHojas[this.contCliente] = await imgData;
      await this.doc.addImage(this.ArrayHojas[this.contCliente], 'JPEG', 5, 5, width - 10, height - 10);

      if (this.contCliente <= this.ListaCliente.length) {
        this.contCliente++;
        if (this.contCliente < this.ListaCliente.length) {
          this.doc.addPage();
        }
        this.ObtenerConsumo();
      }

      if (this.contCliente > (this.ListaCliente.length)) {
        const fileName = "Facturas.pdf";
        this.doc.save(fileName);
        this.doc = new jsPDF("p", "mm", "letter");
        this.Hojas = 0;
        this.contClienteLimit = this.contCliente + 1;
        this.indicadorPDF = 1;
        this.LimpiarConceptoCobro(1);
      }

    });
  }

  ObtenerConsumo() {
    this.Cliente_Consumo1 = 0;
    this.Cliente_Consumo2 = 0;
    this.Nulos = false;

    if (this.indicadorPDF == 1 && this.contCliente > this.ListaCliente.length) {
      this.indicadorPDF = 0;
      this.contCliente = 0;
    }
    if (this.Fecha1 != "" || this.Fecha2 != "") {
      if (this.ListaCliente.length != 0) {
        let y = 0;
        let cont = this.contCliente;
        let html = `<h5>Generando facturas ${cont + 1} de ${this.ListaCliente.length}<h5>
        <div class="spinner-grow text-primary" role="status">
        <span class="sr-only">Loading...</span>
        </div>`;
        if (this.contCliente <= this.ListaCliente.length - 1) {
          this.ConsumoHistorico = [];
          this.DibujarGrafico();

          if (this.contCliente > 0) {
            Swal.update({
              html: html,
              showConfirmButton: false
            });
          }

          if (this.contCliente < 1) {
            Swal.fire({
              title: '<strong  style="font-size:medium;">OBTENIENDO Y CALCULANDO DATOS DEL CLIENTE.</strong>',
              html: html,
              showConfirmButton: false
            });
          }
          for (y = this.contCliente; y <= this.contCliente; y++) {
            this.ObtenerCodigo(this.ListaCliente[y].ID);

            this.ConsumoS.ConsumoCliente(this.ListaCliente[y].ID, this.Fecha1, this.Fecha2, this.Fecha1_Anterior, this.HistoricoFinalFechaI, this.HistoricoInicioFechaI, this.HistoricoInicioFechaF, this.HistoricoFinalFechaF).subscribe(
              async (Data) => {
                this.Cliente_ConsumoI = await Data[0];
                this.Cliente_ConsumoF = await Data[6];
                this.DatosNotNull = await Data[12];

                for (let x = 0; x < this.Cliente_ConsumoI.length; x++) {
                  if (this.Cliente_ConsumoI[x].Value != 0) {
                    this.Cliente_Consumo1 = Math.round(this.Cliente_ConsumoI[x].Value * 100) / 100;
                    x = this.Cliente_ConsumoI.length;
                  }
                }

                for (let x = 0; x < this.Cliente_ConsumoF.length; x++) {
                  if (this.Cliente_ConsumoF[x].Value != 0) {
                    this.Cliente_Consumo2 = Math.round(this.Cliente_ConsumoF[x].Value * 100) / 100;
                    x = this.Cliente_ConsumoF.length;
                  }
                }

                this.ClienteConsumoTotal = this.Cliente_Consumo2 - this.Cliente_Consumo1;

                if (this.ClienteConsumoTotal < 0) {
                  this.ClienteConsumoTotal = this.ClienteConsumoTotal * (-1);
                }

                let inicio = 0, fin = 0, n = 5;
                for (let d = 0; d <= 5; d++) {
                  n++;
                  // 1 - 5 Datos historicos iniciales

                  for (let item of await Data[n]) {
                    inicio = item.Value;
                  }
                  // 7 - 11 Datos historicos finales
                  for (let item of await Data[d]) {
                    fin = item.Value;
                  }

                  if (inicio > fin) {
                    this.ConsumoHistorico[d] = fin - 0;
                  } else {
                    this.ConsumoHistorico[d] = Math.round((fin - inicio) * 100) / 100;
                  }
                  if (d == 0) {
                    this.ConsumoHistorico[d] = this.ClienteConsumoTotal;
                  }
                  inicio = 0;
                  fin = 0;
                }

                this.DibujarGrafico();
                let fechalocal, datos = 0, valor = 0, lista = 0;

                for (let fila = 0; fila < this.dias_facturados; fila++) {
                  if (fila == 0) {
                    this.FechaInicial.setDate(this.FechaInicial.getDate());
                  } else {
                    this.FechaInicial.setDate(this.FechaInicial.getDate() + 1);
                  }

                  fechalocal = moment(this.FechaInicial).format('YYYY-MM-DD').toString();
                  datos = 0;
                  valor = 0;
                  lista = this.DatosNotNull.filter(x => x.TimestampUTC.toString().includes(fechalocal)).length;
                  for (let row of this.DatosNotNull.filter(x => moment(x.TimestampUTC).format('YYYY-MM-DD').toString() == fechalocal)) {
                    if (row.Value != null) {
                      valor++;
                    }
                  }

                  if (lista == 0) {
                    this.ListaVacios.push(new VacioModel(fechalocal, 96));
                    if (this.Nulos == false) {
                      this.Nulos = true;
                    }
                  } else {
                    datos = Math.abs(96 - valor);
                    if (datos > 0) {

                      if (datos >= 80) {
                        if (this.Nulos == false) {
                          this.Nulos = true;
                        }
                      }
                      this.ListaNulos.push(new VacioModel(fechalocal, datos));
                    }
                  }

                  if (fila == this.dias_facturados - 1) {
                    this.FechaInicial.setDate(this.FechaInicial.getDate() - fila);
                  }

                }
                if (this.ClienteConsumoTotal == 0 && this.Multiplicador == 0) {
                  Swal.fire({
                    type: 'warning',
                    title: 'Consumo',
                    text: 'El cliente seleccionado no tiene consumo, favor, eliga otro cliente.'
                  });
                } else {
                  this.ValidarDatos('Cliente');
                  this.ObtenerComsumoTorre();
                }
              },
              (err) => {
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Hubo problemas al obtener los datos.'
                });
                console.log(err);
              });
          }
        } else {
          this.contCliente++;
          let mensaje = "";
          if (this.ListaCliente.length > 1) {
            mensaje = 'Facturas generadas exitosamente';
          } else {
            mensaje = 'Datos cargados exitosamente';
          }
          Swal.fire({
            type: 'success',
            title: 'CORRECTO',
            text: mensaje
          });
        }
      } else {
        Swal.fire({
          type: 'warning',
          title: 'Cliente',
          text: 'Cliente en blanco'
        });
      }

    } else {
      Swal.fire({
        type: 'warning',
        title: 'Fechas...',
        text: 'Rango de fechas incompleto'
      });
    }
  }

  async ObtenerComsumoTorre() {
    if (this.Torre_Total == 0 && this.Multiplicador == 0) {
      this.ConsumoS.ConsumoTorre(this.Fecha1, this.Fecha2, this.MedI, this.MedF).subscribe(
        async (Data: []) => {

          let Consumo = [{
            Resultado: 0
          }]

          Consumo = await Data;
          this.Torre_Total = parseFloat((Consumo[0].Resultado).toString());
          this.Torre_Total = Math.abs(this.Torre_Total);

          this.Multiplicador = Math.round(((this.ClienteConsumoTotal / this.Torre_Total) * this.Enee_Consumo) / this.ClienteConsumoTotal * 100) / 100;
          this.ValidarDatos('Torre');
          this.generatePdf();
          this.cd.detectChanges();
        },
        (err) => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Hubo problemas al obtener los datos de la torre.'
          });
          console.log(err);
        });
    } else {
      this.ValidarDatos('Torre');
      await this.delay(2000);
      this.generatePdf();
      this.cd.detectChanges();
    }
  }

  async DibujarGrafico() {
    for (let j = 0; j <= 5; j++) {
      for (let row of this.MesesNombre.filter(x => x.id == this.Meses[j])) {
        this.barChartLabels[j] = row.mes;
      }
    }

    let data = [this.ConsumoHistorico[5], this.ConsumoHistorico[4], this.ConsumoHistorico[3], this.ConsumoHistorico[2],
    this.ConsumoHistorico[1], this.ConsumoHistorico[0]];

    let Dataclon = JSON.parse(JSON.stringify(this.barChartData));
    Dataclon[0].data = data;
    this.barChartData = await Dataclon;
    this.cd.detectChanges();
  }

  ModalLG(content) {
    this.LimpiarConceptoCobro(0);
    if (this.FechaFinal == this.Calendario.getToday()) {
      this.FechaInicio = this.Calendario.getToday();
      this.FechaFinal = this.Calendario.getToday();
    }
    this.Modal.open(content, { size: 'lg' });
  }

  onDateSelection(date: NgbDate) {
    if (!this.FechaInicio && !this.FechaFinal) {
      this.FechaInicio = this.Calendario.getToday();
      this.FechaFinal = this.Calendario.getToday();

    } else if (this.FechaInicio && !this.FechaFinal && date.after(this.FechaInicio)) {
      this.FechaFinal = date;
      this.ObtenerFechas(this.FechaInicio, this.FechaFinal);

    } else {
      this.FechaFinal = null;
      this.FechaInicio = date;
    }
  }

  ObtenerFechas(Finicio, Ffinal) {
    //let FIS: string = Finicio.day+"-"+Finicio.month+"-"+Finicio.year;
    //COMPARACION DE TAMAÑO DE MESES, SI ES MENOR QUE 1 COLOCAR UN O ANTES DEL MES
    //MES INICIO
    this.Multiplicador = 0;
    this.Torre_Total = 0;
    this.ClienteConsumoTotal = 0;
    this.Cliente_Consumo1 = 0;
    this.Cliente_Consumo2 = 0;
    let MesInicio, MesFinal, DiaInicio, DiaFinal = "";
    //MES INICIO
    if ((Finicio.month < 10)) {
      MesInicio = "0" + Finicio.month;
    } else {
      MesInicio = Finicio.month;
    }
    //MES FINAL
    if ((Ffinal.month < 10)) {
      MesFinal = "0" + Ffinal.month;
    } else {
      MesFinal = Ffinal.month;
    }
    //COMPARACION DE TAMAÑO DE DIAS, SI ES MENOR QUE 1 COLOCAR UN O ANTES DEL DIA
    //DIA INICIO
    if ((Finicio.day < 10)) {
      DiaInicio = "0" + Finicio.day;
    } else {
      DiaInicio = Finicio.day;
    }
    //DIA FINAL
    if ((Ffinal.day < 10)) {
      DiaFinal = "0" + Ffinal.day;
    } else {
      DiaFinal = Ffinal.day;
    }

    this.FechaFormatI = DiaInicio + "/" + MesInicio + "/" + Finicio.year;
    this.FechaFormatF = DiaFinal + "/" + MesFinal + "/" + Ffinal.year;

    this.Fecha1 = Finicio.year + "-" + MesInicio + "-" + DiaInicio;
    this.Fecha2 = Ffinal.year + "-" + MesFinal + "-" + DiaFinal;

    let I = new Date(MesInicio + "-" + DiaInicio + "-" + Finicio.year);
    let F = new Date(this.Fecha2);

    let FIAnterior = new Date(I);
    //let FFSiguiente = new Date(F);
    let FFSiguiente = new Date(this.Fecha2);
    this.FechaInicial = new Date(I);
    FIAnterior.setDate(I.getDate() - 1);
    FFSiguiente.setDate(F.getDate() + 2);

    this.Fecha1_Anterior = moment(FIAnterior).format('YYYY-MM-DD').toString();
    this.Fecha2 = moment(FFSiguiente).format('YYYY-MM-DD').toString();

    let f1 = new Date(Finicio.year, Finicio.month - 1, Finicio.day);
    let f2 = new Date(Ffinal.year, Ffinal.month - 1, Ffinal.day);

    let diff = Math.abs(f2.getTime() - f1.getTime());

    this.dias_facturados = Math.ceil(diff / (1000 * 3600 * 24));

    this.numero_factura = moment(new Date()).format('YY-MM') + "-";

    /* ******************************************************************** */
    //let FI = new Date(MesInicio + "-" + DiaInicio + "-" + Finicio.year);
    //let FF = new Date(MesFinal + "-" + DiaFinal + "-" + Ffinal.year);

    let FI = new Date(this.Fecha1);
    let FF = new Date(this.Fecha2);

    let FIActual = new Date(FI);
    let FFActual = new Date(FF);
    let FIAnterior2 = new Date(moment(FI.setDate(FI.getDate())).format('YYYY-MM-DD').toString());
    let FFSiguiente2 = new Date(moment(FF.setDate(FF.getDate() + 2)).format('YYYY-MM-DD').toString());

    let mes = 0, n = 4;
    for (let d = 0; d <= 4; d++) {

      FIActual.setMonth(FIActual.getMonth() - 1);
      FIAnterior2.setMonth(FIAnterior2.getMonth() - 1);

      this.HistoricoInicioFechaI[d] = moment(FIActual).format('YYYY-MM-DD').toString();
      this.HistoricoFinalFechaI[d] = moment(FIAnterior2).format('YYYY-MM-DD').toString();

      FFActual.setMonth(FFActual.getMonth() - 1);
      FFSiguiente2.setMonth(FFSiguiente2.getMonth() - 1);

      mes = parseInt(moment(FFActual).format('MM').toString());
      this.Meses[n] = mes;
      n--;

      this.HistoricoInicioFechaF[d] = moment(FFActual).format('YYYY-MM-DD').toString();
      this.HistoricoFinalFechaF[d] = moment(FFSiguiente2).format('YYYY-MM-DD').toString();
    }
    this.Meses[5] = parseInt(MesFinal);
  }

  isHovered(date: NgbDate) {
    return this.FechaInicio && !this.FechaFinal && this.hoveredDate && date.after(this.FechaInicio) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.FechaInicio) && date.before(this.FechaFinal);
  }

  isRange(date: NgbDate) {
    return date.equals(this.FechaInicio) || date.equals(this.FechaFinal) || this.isInside(date) || this.isHovered(date);
  }

  ValidarDatos(opcion) {
    if (this.Cliente_ConsumoI.length != 0 &&
      this.Cliente_ConsumoF.length != 0 &&
      this.ConsumoHistorico.length != 0 &&
      this.Torre_Total != 0 && this.Multiplicador != 0
    ) {
      this.TotalFactura = 0;
      for (let item of this.ConceptoCobroLps) {
        if (item.id == 1) {
          item.valor = Math.round((this.LPS * (this.ClienteConsumoTotal * this.Multiplicador)) * 100) / 100;
        }
        this.TotalFactura += item.valor;
      }
    } else {
      this.TotalFactura = 0;
      for (let item of this.ConceptoCobroLps) {
        if (item.id == 1) {
          item.valor = 0;
        }
      }
    }
  }

  CalcularTotal(id, valor: number) {
    for (let item of this.ConceptoCobroLps.filter(x => x.id == id)) {
      if (item.id != 1) {
        this.TotalFactura -= Math.round(item.valor * 100) / 100;
        item.valor = Math.round(valor * 100) / 100;
        this.TotalFactura += Math.round(item.valor * 100) / 100;
        this.cd.detectChanges();
      }
    }
  }

  LimpiarConceptoCobro(indicador) {
    if (indicador == 1) {
      this.SaldoPendiente = 0;
      for (let item of this.ConceptoCobroLps) {
        item.valor = 0;
      }
    }
    this.TotalFactura = 0;
    this.NombreTorre = "...";
    this.Nulos = false;
    this.contCliente = 0;
    this.Cliente_Codigo = "-";
    this.Cliente_Nombre = "";
    this.Cliente_N_Medidor = "";
    this.Cliente_Medidor = 0;
    this.dias_facturados = 0;
    this.ClienteConsumoTotal = 0.00;
    this.Multiplicador = 0.00
    this.FechaFormatF = "";
    this.FechaFormatI = "";
    this.FechaInicio = this.Calendario.getToday();
    this.FechaFinal = this.Calendario.getToday();
    this.Fecha_Vencimiento = this.Calendario.getToday();
    this.FechaActual = new Date();
    this.Cliente_Consumo2 = 0;
    this.Cliente_Consumo1 = 0;
    this.numero_factura = "-";
    this.cmbTorre = 0;
    this.ListaCliente = [];
    this.barChartData = [{
      data: [0, 0, 0, 0, 0, this.ClienteConsumoTotal],
      label: 'CONSUMO'
    }];
    this.cd.detectChanges();
  }

  setSelectedPeople3() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      selectAllText: 'Todos',
      unSelectAllText: 'Ninguno',
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No hay datos'
    }
  }

  onItemSelect(item: any) {
    //console.log(item);
    this.ListaCliente.push(new ClienteListaModel(item.ID, item.Name));
    console.log(this.ListaCliente);
  }

  onSelectAll(items: any) {
    console.log(items.length);
    this.ListaCliente = [];
    for (let n = 0; n < items.length; n++) {
      this.ListaCliente.push(new ClienteListaModel(items[n].ID, items[n].Name));
    }
    console.log(this.ListaCliente);
  }

  onDeSelect(item: any) {
    //console.log(item);
    let cont = 0, posicion = 0;
    for (let row of this.ListaCliente) {
      cont++;
      if (row.ID == item.ID) {
        posicion = cont;
      }
    }
    this.ListaCliente.splice(posicion - 1, 1);
    console.log(this.ListaCliente);
  }

  onDeSelectAll(items: any) {
    //console.log(items.length);
    this.ListaCliente = [];
    console.log(this.ListaCliente);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}