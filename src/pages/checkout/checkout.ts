import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public alertCtrl:AlertController) {
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;
    this.paymentMethods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer" },
      { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "paypal", method_title: "PayPal" }];
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
    this.storage.get('userLoginInfo').then((userLoginInfo)=>{
      this.userInfo=userLoginInfo.user;
      let email=userLoginInfo.user.email;

      this.WooCommerce.getAsync('customers/email/'+email).then((data)=>{
        this.newOrder=JSON.parse(data.body).customer;
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }

  placeOrder(){
    let orderItems:any[]=[];
    let data:any={};
    let paymentData:any={};
    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });

    data={
      payment_details:{
        method_id:paymentData.method_id,
        method_title:paymentData.method_title,
        paid:true
      },
      billing_address:this.newOrder.billing_address,
      shipping_address:this.newOrder.shipping_address,
      customer_id:this.userInfo.id || '',
      line_items:orderItems
    };

    if(paymentData.method_id=='paypal'){
      //TODO
    }
    else{
      this.storage.get('cart').then((cart)=>{
          cart.forEach((element,index)=>{
            orderItems.push({
              product_id:element.product.id,
              quantity:element.qty
            });
          });

          data.line_items =orderItems;

          let orderData:any={};
          orderData.order=data;

          this.WooCommerce.postAsync('orders',orderData).then((data)=>{
            let response = (JSON.parse(data.body).order);
            
                      this.alertCtrl.create({
                        title: "Order Placed Successfully",
                        message: "Your order has been placed successfully. Your order number is " + response.order_number,
                        buttons: [{
                          text: "OK",
                          handler: () => {
                            this.navCtrl.setRoot('HomePage');
                          }
                        }]
                      }).present();
          })

      })
    }
  }

}
