import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, IonicPage } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { CartPage } from "../cart/cart";
import { SocialSharing } from '@ionic-native/social-sharing' ;
@IonicPage({})
@Component({
  selector: 'page-products-details',
  templateUrl: 'products-details.html',
})
export class ProductsDetailsPage {
  product:any=[];
  WooCommerce:any;
  reviews:any[]=[];
  totalCount:number=0;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
               private toastCtrl : ToastController,public modalCtrl: ModalController,private socialSharing: SocialSharing) {
    this.product=this.navParams.get('product');
    this.storage.ready().then(()=>{
      this.storage.get('cart').then((data)=>{
        if(data!=null){
          this.totalCount=parseInt(data.length);
        }
        
      })
    });
    this.WooCommerce =WC({
      url:"http://souvikboss.000webhostapp.com/wordpress",
      consumerKey:"ck_98bc20431c015c03d0f9b107a602603a59424011",
      consumerSecret:"cs_cd015e09836b30002aa1aa50a1e358001b96e5ea"
    });

    this.WooCommerce.getAsync('products/'+this.product.id+'/reviews').then((data)=>{
      console.log(JSON.parse(data.body).product_reviews);
      this.reviews=JSON.parse(data.body).product_reviews;
      
      },(err)=>{
        console.log(err);
      });
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsDetailsPage');
  }

  addToCart(product){
      this.storage.get('cart').then((data)=>{
        if(data==null){
          data=[];
          data.push({
            'product':product,
            'qty':1,
            'amount': parseFloat(product.price)
          });
        }
        else{
          let added=0;
          for(let i=0; i< data.length;i++){
            if(product.id == data[i].product.id){
              console.log('product is already in cart');
              let qty=data[i].qty;
              data[i].qty=qty+1;
              data[i].amount=parseFloat(data[i].amount)+parseFloat(data[i].product.price);
              added=1;
            }
          }
          if(added==0){
            data.push({
              'product':product,
              'qty':1,
              'amount': parseFloat(product.price)
            });
          }
        }
        if(data!=null){
        this.totalCount=parseInt(data.length);
        }
        this.storage.set('cart',data).then((data)=>{
          console.log('Cart Updated');
          this.toastCtrl.create({
            'message':'Product added to the cart successfully',
            'duration':3000
          }).present();
        });

      });
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }
  shareFacebook(product){
    this.socialSharing.shareViaFacebook(product.title,product.featured_src,null)
      .then(() => {
        console.log("sucess");
      }).catch((error) => {
        console.log("erro");
      });
  }

}
