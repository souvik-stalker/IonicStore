import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductsDetailsPage } from "../products-details/products-details";
@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  WooCommerce:any;
  products:any[];
  category:any;
  page:number;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast:ToastController,
              public loadingController :LoadingController) {

    this.page=1;
    this.category=this.navParams.get('category');
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

    let loader=this.loadingController.create({
      content:"Geting products"
      //spinner:'dots'
    });
    loader.present().then(()=>{
      this.WooCommerce.getAsync("products?filter[category]="+this.category.slug).then((data)=>{
        console.log(JSON.parse(data.body));
        this.products=JSON.parse(data.body).products;
        loader.dismiss();
        },(err)=>{
          console.log(err);
        });
        
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
      this.page++;
    this.WooCommerce.getAsync("products?filter[category]="+this.category.slug+"&page="+this.page).then((data)=>{
      console.log(JSON.parse(data.body));
      this.products=this.products.concat(JSON.parse(data.body).products);
        event.complete();
      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);
        this.toast.create({
          message:"No More Products",
          duration:5000
        }).present();
      }

  },(err)=>{
    console.log(err);
  });
  }
  productDetail(product){
    this.navCtrl.push(ProductsDetailsPage,{'product':product});
}
}
