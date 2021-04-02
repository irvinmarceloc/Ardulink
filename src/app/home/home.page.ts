import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  Devices = [{"name": 'B1', "address": '123', "id":'1', "class":'Arduino'},
  {"name": 'B1', "address": '123', "id":'1', "class":'Arduino'},
  {"name": 'B1', "address": '123', "id":'1', "class":'Arduino'}  ]
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}
  /*Enviar datos*/
  sendData(data){
    this.bluetoothSerial.write(data).then(Response=>{
      console.log("Enviado con exito")
    }, error=>{
      console.log("Hubo problemas problema")
    })
  }
  /*Desconectar del dispositivo*/
  disconnected(){
    this.bluetoothSerial.disconnect()
    console.log('dispositivo desconectado')
  }
  /* Funcion OnBluetooth */
  onBluetooth(){
    this.bluetoothSerial.isEnabled().then(Response=>{
      this.isEnabled("Activado");
      this.Listdevices()
    }, error =>{
      this.isEnabled("Desactivado")
    })
  }
  /* Fin Onbluetooth*/
  /* Funcion Listdevices */
  Listdevices(){
    this.bluetoothSerial.list().then(
      response=> {
        this.Devices = response
      }, error=>{
        console.log('Error')
      }
    )
  }
  /* Fin Listdevices */
  /* Funcion isEnabled */
  async isEnabled(msg){
    const alert= await this.alertController.create({
      header: 'Alerta',
      message: msg,
      buttons: [{
        text: 'Ok',
        handler: ()=>{
          console.log('Ok')
        }
      }]
    })
  }
  /* Fin isEnabled */
  /* Funcion Connect*/
  async isConnect(address, name){
    const alert= await this.alertController.create({
      header: 'Alerta',
      message: 'Desea conectarse a este dispositivo '+ name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {text: 'Ok',
          handler: ()=>{
            this.connect(address)
          }
        }, 
      ]
    })
    await alert.present();
  }
  
  connect(address){
    this.bluetoothSerial.connect(address).subscribe(success=>{
        
    },error=>{
      console.log(error);
    })
  }
  /* Fin Connect*/
  /* Funcion Device connected*/
  deviceConnected(){
    this.bluetoothSerial.subscribe('\n').subscribe(success=>{
      this.hundler(success)
    }, error=>{
      console.log('ocurrio un error')
    })
  }
  /* hundler */ 
  hundler(value){
    console.log(value)
  }
}
