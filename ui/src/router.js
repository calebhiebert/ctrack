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

import gql from 'graphql-tag';
import store from './store';
import { apolloClient } from './main';

Vue.use(Router);

const authGuard = async (to, from, next) => {
	if (store.state.me) {
		next();
	} else {
		const authDetails = await apolloClient.query({
			query: gql`
				query AuthCheck {
					me {
						id
						name
					}
				}
			`,
		});

		const authResult = authDetails.data.me;

		if (authResult !== null) {
			store.commit('setUser', authResult);
			next();
		} else {
			if (to.name === 'room-id') {
				localStorage.setItem('room-id-after-login', to.params.id);
			}

			next({ name: 'login' });
		}
	}
};

const loginGuard = async (to, from, next) => {
	console.log(to);

	if (store.state.me) {
		next({ name: 'home' });
	} else {
		const authDetails = await apolloClient.query({
			query: gql`
				query AuthCheck {
					me {
						id
						name
					}
				}
			`,
		});

		const authResult = authDetails.data.me;

		if (authResult !== null) {
			store.commit('setUser', authResult);
			next({ name: 'home' });
		} else {
			next();
		}
	}
};

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			redirect: '/room/create',
			beforeEnter: authGuard,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			beforeEnter: loginGuard,
		},
		{
			path: '/room/create',
			name: 'room-create',
			component: CreateRoom,
			beforeEnter: authGuard,
		},
		{
			path: '/room/join',
			name: 'room-join',
			component: JoinRoom,
			beforeEnter: authGuard,
		},
		{
			path: '/room/:id',
			name: 'room-id',
			component: RoomLanding,
			beforeEnter: authGuard,
		},
		{
			path: '/room/:id/spectate',
			name: 'room-id-spectate',
			component: RoomSpectate,
			beforeEnter: authGuard,
		},
		{
			path: '/room/:id/character',
			name: 'room-id-character',
			component: RoomCharacter,
			beforeEnter: authGuard,
		},
		{
			path: '/room/:id/manage',
			name: 'room-id-manage',
			component: RoomManage,
			beforeEnter: authGuard,
		},
	],
});
