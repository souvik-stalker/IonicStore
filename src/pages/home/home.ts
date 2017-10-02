import { Component, ViewChild } from '@angular/core';
import { IonicPage,NavController, Slides, ToastController, LoadingController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
@IonicPage({})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";
  @ViewChild('productSlides') productSlides: Slides;
  constructor(public navCtrl: NavController, private toast: ToastController, public loadingctrl: LoadingController) {
    /* this.WooCommerce =WC({
       url:"http://localhost/udemy/wordpress",
       consumerKey:"ck_677e98ab7785d85c12ad60ffb9d5c90b2ff3f35a",
       consumerSecret:"cs_e7f30b222065075a6575212ba4e1e9e2c2b086d6"
     });
 */
    this.WooCommerce = WC({
      url: "http://souvikboss.000webhostapp.com/wordpress",
      consumerKey: "ck_98bc20431c015c03d0f9b107a602603a59424011",
      consumerSecret: "cs_cd015e09836b30002aa1aa50a1e358001b96e5ea"
    });

    let loader = this.loadingctrl.create({
      content: "Geting products"
    });
    loader.present().then(() => {
      this.loadMoreProducts(null);

      this.WooCommerce.getAsync("products").then((data) => {
        console.log(JSON.parse(data.body));
        this.products = JSON.parse(data.body).products;
        loader.dismiss();
      }, (err) => {
        console.log(err);
        loader.dismiss();
      });

    })


  }

  ionViewDidLoad() {
    setInterval(() => {
      if (this.productSlides.getActiveIndex() == this.productSlides.length() - 1) {
        this.productSlides.slideTo(0);
      }
      this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event) {
    if (event === null) {
      this.page = 2;
      this.moreProducts = [];
    }
    else {
      this.page++;
    }
    this.WooCommerce.getAsync("products?page=" + this.page).then((data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if (event != null) {
        event.complete();
      }
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
  onSearch(event) {
    if (this.searchQuery.length > 0) {
      this.navCtrl.push('SearchPage', { searchQuery: this.searchQuery });
    }
  }
  
}
