import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import * as WC from 'woocommerce-api';
@IonicPage({})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingController: LoadingController, public toast: ToastController) {
    console.log(this.navParams.get('searchQuery'));
    this.page = 1;
    this.searchQuery = this.navParams.get('searchQuery');
    /* this.WooCommerce =WC({
     url:"http://localhost/udemy/wordpress",
     consumerKey:"ck_677e98ab7785d85c12ad60ffb9d5c90b2ff3f35a",
     consumerSecret:"cs_e7f30b222065075a6575212ba4e1e9e2c2b086d6"
    
   });*/

    this.WooCommerce = WC({
      url: "http://souvikboss.000webhostapp.com/wordpress/",
      consumerKey: "ck_98bc20431c015c03d0f9b107a602603a59424011",
      consumerSecret: "cs_cd015e09836b30002aa1aa50a1e358001b96e5ea"
    });

    let loader = this.loadingController.create({
      content: "Geting products"
      //spinner:'dots'
    });
    loader.present().then(() => {
      this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((data) => {
        console.log(JSON.parse(data.body));
        this.products = JSON.parse(data.body).products;
        loader.dismiss();
      }, (err) => {
        console.log(err);
        loader.dismiss();
      });

    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

  }
  loadMoreProducts(event) {
    this.page++;
    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((data) => {
      this.products = this.products.concat(JSON.parse(data.body).products);
      event.complete();
      if (JSON.parse(data.body).products.length < 10) {
        event.enable(false);
        this.toast.create({
          message: "No More Products",
          duration: 5000
        }).present();
      }

    }, (err) => {
      console.log(err);
    });
  }
  productDetail(product) {
    this.navCtrl.push('ProductsDetailsPage', { 'product': product });
  }

}
