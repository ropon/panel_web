// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import "../static/global/index.css"
import store from '../src/store'

import * as api from './restful/api'
Vue.prototype.$http = api

import md5 from 'js-md5';
Vue.prototype.$md5 = md5

// import socketio from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io';
// Vue.use(VueSocketIO, socketio('http://127.0.0.1:5000'))

Vue.config.productionTip = false;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) { //表示用户访问该组件需要登录
        if (!localStorage.getItem('token')) {
            next({
                name: 'Login'
            })
        } else {
            let user = {
                token: localStorage.getItem('token'),
                username: localStorage.getItem('username')
            };
            store.dispatch('getUserInfo', user);
            next()
        }
    } else {
        //放行
        next()
    }
});

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
