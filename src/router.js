import Vue from 'vue';
import VueRouter from 'vue-router';
import Users from './components/Users.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { path: '/', redirect: '/users' },
        { path: '/users', component: Users }
    ]
});
