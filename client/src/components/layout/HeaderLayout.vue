<template>
<nav class="navbar is-primary is-fixed-top">
	<div class="navbar-brand">
		<!-- title -->
		<h4 class="navbar-item title is-4 route-title">{{$route.meta.title}}</h4>
		<!-- burger -->
		<div
			class="navbar-burger burger"
			v-if="amIAuthed"
			@click="toggleMobMenu()"
			:class="{'is-active': showMobMenu}"
		>
			<span></span><span></span><span></span>
		</div>
	</div>
	<!-- desktop menu -->
	<div class="navbar-menu">
		<div class="navbar-end" v-if="amIAuthed">
            <h4 class="navbar-item title is-4 route-title">{{$store.state.user.data && $store.state.user.data.name}}</h4>
		</div>
	</div>
	<!-- mob menu -->
	<ul
		class="mob-nav"
		v-if="amIAuthed"
		:class="{'is-active': showMobMenu}"
		@click="toggleMobMenu()"
	>
        <li
            v-for="link in loggedRoutes"
            :key="link.name"
        >
            <router-link :to="'/' + link.name">{{link.name}}</router-link>
        </li>
		<li @click="logOut($event)">logout</li>
	</ul>
</nav>
</template>

<script>
import {actions, getters} from '@/store/types';
import loggedRoutes from '@/router/loggedRoutes';

export default {
    name: 'HeaderLayout',
    data() {
        return {
            showMobMenu: false,
            loggedRoutes,
        };
    },
    computed: {
        amIAuthed() {
            return this.$store.getters[getters.IS_AUTHED];
        },
    },
    methods: {
        logOut(e) {
            e.preventDefault();
            this.$store.dispatch(actions.USER_LOGOUT);
        },
        toggleMobMenu() {
            this.showMobMenu = !this.showMobMenu;
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    padding: 0 10px;
    @media screen and (max-width: 1023px) {
        padding: 0;
    }
}
.route-title {
	margin: 0 !important;
}
.mob-nav {
    display: none;
	@media screen and (max-width: 1023px) {
		position: fixed;
		top: 52px;
		left: 0;
		height: calc(100% - 52px);
		width: 100%;
		z-index: 5;
		background: white;		
		padding: 20px;
		li {
			padding: 15px;
			color: black;
			text-transform: uppercase;
			font-weight: 500;
		}
		&.is-active {
			display: block;
		}
	}
}
</style>