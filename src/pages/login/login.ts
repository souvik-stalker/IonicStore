import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, IonicPage,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
@IonicPage({})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username:string;
  password:string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http:Http,
              public toastCtrl:ToastController,
              public storage:Storage,
              public alertCtrl:AlertController,
              public loadingCtrl:LoadingController) {
    this.username="";
    this.password="";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  public login():void{

     let loader=this.loadingCtrl.create({
       content:"Please wait..."
     });

     loader.present().then(()=>{
      this.http.get('http://souvikboss.000webhostapp.com/wordpress/api/auth/generate_auth_cookie/?insecure=cool&username='+this.username+'&password='+this.password)
      .subscribe((res)=>{
        let response=res.json();
        loader.dismiss();
        if(response.error){
          this.toastCtrl.create({
            message:response.error,
            duration:3000
          }).present();
          return;
        }

          this.storage.set('userLoginInfo',response).then((data)=>{
            this.alertCtrl.create({
              title:"Login Successfull",
              message:"You have been Logged in Successfully",
              buttons:[{
                text:"OK",
                handler:()=>{
                  if(this.navParams.get("next")){
                    this.navCtrl.push(this.navParams.get("next"));
                  }
                  else{
                    this.navCtrl.pop();
                  }
                }
              }]
            }).present();
          })

      });
     })
      
  }
}
