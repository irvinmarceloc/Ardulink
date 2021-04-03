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
  Devices 
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.Listdevices();
  }
  /*Enviar datos*/
  sendData(data){
    this.bluetoothSerial.write(data).then(Response=>{
      console.log("Enviado con exito")
    }, error=>{
      console.log("Hubo problemas problema")
    })
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enviar',
      inputs: [
        {
          name: 'data',
          type: 'text',
          placeholder: 'ingrese mensaje'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.presentLoading();
            this.sendData(data["data"]);
          }
        }
      ]
    });

    await alert.present();
  }


  /*Desconectar del dispositivo*/
  async disconnected(){
    this.bluetoothSerial.disconnect()
    await this.presentLoading()
    this.isEnabled("Dispositivo desconectado")
    console.log('dispositivo desconectado')
  }
  /* Funcion OnBluetooth */
  onBluetooth(){
    this.bluetoothSerial.isEnabled().then(Response=>{
      this.isEnabled("Activado");
    }, error =>{
      this.isEnabled("Desactivado")
    })
  }
  /* Fin Onbluetooth*/
  /* Funcion Listdevices */
  Listdevices(){
    this.onBluetooth();
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
    await alert.present();
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
  /*Cargando */ 
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
