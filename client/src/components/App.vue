<template>
    <div
		id="app"
		:class="appCssClass"
	>
        <sidebar-layout v-if="amIAuthed"></sidebar-layout>
        <div class="main">
            <router-view :key="$route.path"></router-view>
        </div>
        <header-layout></header-layout>
    </div>
</template>

<script>
import SidebarLayout from '@/components/layout/SidebarLayout.vue';
import HeaderLayout from '@/components/layout/HeaderLayout.vue';
import {actions, getters} from '@/store/constants';

export default {
    name: 'app',
    components: {SidebarLayout, HeaderLayout},
    created() {
        this.$store.dispatch(actions.APP_INIT);
    },
    computed: {
        amIAuthed() {
            return this.$store.getters[getters.AM_I_AUTHED];
		},
		appCssClass() {
			return ['app-' + this.$route.name, {'authed': this.amIAuthed}];
		},
    }
};
</script>

<style lang="scss">
#app {
    height: 100%;
    width: 100%;
	display: flex;
    flex-direction: row;
	padding-top: 60px;

    &.authed {
        @media screen and (max-width: 600px) {
            padding-left: 0;
        }
    }
}
</style>
