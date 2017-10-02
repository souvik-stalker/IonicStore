import { Component,ViewChild } from '@angular/core';
import { IonicPage,NavController, NavParams,ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { CartPage } from "../cart/cart";
@IonicPage({})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {
  public HomePage : any;
  WooCommerce:any;
  categories:any[];
  loggedIn:boolean;
  user:any;
  @ViewChild('content') childNavCtrl : NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public modalCtrl: ModalController) {
    this.HomePage = 'HomePage';
    this.categories=[];
   /* this.WooCommerce =WC({
      url:"http://localhost/udemy/wordpress",
      consumerKey:"ck_677e98ab7785d85c12ad60ffb9d5c90b2ff3f35a",
      consumerSecret:"cs_e7f30b222065075a6575212ba4e1e9e2c2b086d6"
    });
*/
    this.WooCommerce =WC({
      url:"http://souvikboss.000webhostapp.com/wordpress",
      consumerKey:"ck_98bc20431c015c03d0f9b107a602603a59424011",
      consumerSecret:"cs_cd015e09836b30002aa1aa50a1e358001b96e5ea"
    });

    this.WooCommerce.getAsync("products/categories").then((data)=>{
        console.log(JSON.parse(data.body).product_categories);
        let temp :any[]=JSON.parse(data.body).product_categories;
        if(temp.length > 0){
          for(let i=0; i< temp.length; i++){
            if(temp[i].parent == 0){
              if(temp[i].slug =='clothing'){
                temp[i].icon='shirt';
              }
              if(temp[i].slug =='music'){
                temp[i].icon='musical-notes';
              }
              if(temp[i].slug =='posters'){
                temp[i].icon='images';
              }
              this.categories.push(temp[i]);
            }
          }
        }
        
    },(err)=>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
  ionViewDidEnter(){
    this.storage.ready().then(()=>{
      this.storage.get('userLoginInfo').then((userLoginInfo)=>{
        if(userLoginInfo!=null){
          console.log("User Logged In");
          this.user=userLoginInfo.user;
          console.log(this.user);
          this.loggedIn=true;

        }
        else{
          console.log("No User found");
          this.user={};
          this.loggedIn=false;
        }
      })
    })
  }
  openCategoryPage(category){
    this.childNavCtrl.setRoot('ProductsByCategoryPage',{'category':category});
  }
  backToHome(){
    this.childNavCtrl.setRoot('HomePage');
  }

  openPage(pageName:string){
    if(pageName=='signup'){
      this.navCtrl.push('SignupPage');
    }
    else if(pageName=='login'){
      this.navCtrl.push('LoginPage');
    }
    else if(pageName=='logout'){
      this.storage.remove('userLoginInfo').then(()=>{
        this.user={};
        this.loggedIn=false;
      })
    }
    else if(pageName=='cart'){
      this.modalCtrl.create(CartPage).present();
    }
  }

}
