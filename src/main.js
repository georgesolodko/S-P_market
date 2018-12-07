// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import firebase from 'firebase/app'
import { auth } from 'firebase'
import App from './App'

Vue.use(Vuetify,{
  iconfont: 'mdi'
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App :initUid="initUid"/>',
  data: {initUid: null},
  created () {
    const config = {
      apiKey: "AIzaSyBhpbMDLCVYWHHZACTorOik4ZDZH1_bLAI",
      authDomain: "stock-market-98138.firebaseapp.com",
      databaseURL: "https://stock-market-98138.firebaseio.com",
      projectId: "stock-market-98138",
      storageBucket: "stock-market-98138.appspot.com",
      messagingSenderId: "543863998990"
    };
    firebase.initializeApp(config);

    auth().onAuthStateChanged((user) => {
      if (user) {
        this.initUid = user.uid;
      } else {
        this.initUid = null;
      }
    })
  }
});
