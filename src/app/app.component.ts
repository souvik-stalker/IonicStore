import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Menu } from "../pages/menu/menu";
import { SignupPage } from "../pages/signup/signup";
import { OneSignal } from '@ionic-native/onesignal';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Menu;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public oneSignal: OneSignal) {
    this.initializeApp();


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.oneSignal.startInit('43b1f957-7d93-4770-b9b1-fe2f2bc322bc', '977321187937');
      
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      
      this.oneSignal.handleNotificationReceived().subscribe(() => {
       // do something when notification is received
      });
      
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });
      
      this.oneSignal.endInit();
    });
  }

  
}
