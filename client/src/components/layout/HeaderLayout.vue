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
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
	<!-- desktop menu -->
	<div class="navbar-menu">
		<div class="navbar-end" v-if="amIAuthed">
			<router-link
				class="navbar-item"
				to="/profile"
			>{{$store.state.user.data && $store.state.user.data.name}}</router-link>
			<a
				class="navbar-item" to="/settings"
				@click="logOut($event)"
			>
				<b-tooltip
					label="log out"
					position="is-left" type="is-white"
				>
					<span class="icon is-medium">
						<i class="fa fa-power-off fa-lg"></i>
					</span>
				</b-tooltip>
			</a>
		</div>
	</div>
	<!-- mob menu -->
	<ul
		class="mob-nav"
		v-if="amIAuthed"
		:class="{'is-active': showMobMenu}"
		@click="toggleMobMenu()"
	>
		<li><router-link to="/profile">profile</router-link></li>
		<li><router-link to="/settings">settings</router-link></li>
		<li><router-link to="/dashboard">dashboard</router-link></li>
		<li><router-link to="/devices">devices</router-link></li>
		<li><router-link to="/users">users</router-link></li>
		<li @click="logOut($event)">logout</li>
	</ul>
</nav>
</template>

<script>
import {actions, getters} from '@/store/constants';

export default {
    name: 'HeaderLayout',
    data () {
        return {
			showMobMenu: false,
		};
    },
    computed: {
        amIAuthed() {
            return this.$store.getters[getters.AM_I_AUTHED];
        }
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
.route-title {
	margin: 0 !important;
}
.mob-nav {
	display: none;

	@media screen and (max-width: 1024px) {
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