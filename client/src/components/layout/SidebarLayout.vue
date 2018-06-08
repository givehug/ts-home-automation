<template>
<aside class="menu sidebar">
	<ul>
		<li
			v-for="link in links"
			:key="link.name"
            class="link"
		>
			<router-link :to="'/' + link.name">
				<span class="icon">
					<i :class="'fa ' + link.icon"></i>
				</span>
				<!-- <span>{{link.name | capitalize}}</span> -->
			</router-link>
		</li>
	</ul>
    <ul>
		<li class="link">
			<a @click="logOut($event)">
				<span class="icon">
					<i class="fa fa-power-off"></i>
				</span>
			</a>
		</li>
	</ul>
</aside>
</template>

<script>
import {actions} from '@/store/types';
import loggedRoutes from '@/router/loggedRoutes';

export default {
    name: 'SidebarLayout',
    data() {
        return {
            links: loggedRoutes,
        };
    },
    methods: {
        logOut(e) {
            e.preventDefault();
            this.$store.dispatch(actions.USER_LOGOUT);
        },
    },
};
</script>

<style lang="scss" scoped>
.sidebar {
    background: #00d1b2;
    position: fixed;
    top: 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    left: 0;
    flex: 0 0 80px;
    width: 80px;
    padding: 30px 0;
    height: calc(100% - 52px);
	.icon {
        color: white;
	}
	.link {
        vertical-align: middle;
        text-align: center;
        font-size: 35px;
        a {
            display: block;
            width: 100%;
            padding: 15px 0;
            &:hover {
                background: rgba(#00b89c, 0.5);
            }
            &.router-link-active {
                background:#00b89c;
            }
        }
	}
	@media screen and (max-width: 1023px) {
		display: none;
	}
}
</style>