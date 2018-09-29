import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import CreateRoom from './views/CreateRoom.vue';
import Login from './views/Login.vue';
import RoomLanding from './views/RoomLanding.vue';
import RoomCharacter from './views/RoomCharacter.vue';
import RoomManage from './views/RoomManage.vue';
import RoomSpectate from './views/RoomSpectate.vue';
import JoinRoom from './views/JoinRoom.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/room/create',
      name: 'room-create',
      component: CreateRoom,
    },
    {
      path: '/room/join',
      name: 'room-join',
      component: JoinRoom,
    },
    {
      path: '/room/:id',
      name: 'room-id',
      component: RoomLanding,
    },
    {
      path: '/room/:id/spectate',
      name: 'room-id-spectate',
      component: RoomSpectate,
    },
    {
      path: '/room/:id/character',
      name: 'room-id-character',
      component: RoomCharacter,
    },
    {
      path: '/room/:id/manage',
      name: 'room-id-manage',
      component: RoomManage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: 'about' */ './views/About.vue'),
    },
  ],
});
