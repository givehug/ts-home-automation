<template>
  <div
		id="app"
		:class="appCssClass"
	>
    <sidebar-layout v-if="amIAuthed"></sidebar-layout>
    <router-view :key="$route.path"></router-view>
    <header-layout></header-layout>
  </div>
</template>

<script>
import HeaderLayout from '@/components/layout/HeaderLayout.vue';
import SidebarLayout from '@/components/layout/SidebarLayout.vue';
import {actions, getters} from '@/store/types';

export default {
  name: 'app',
  components: {SidebarLayout, HeaderLayout},
  created() {
    this.$store.dispatch(actions.APP_INIT);
  },
  computed: {
    amIAuthed() {
      return this.$store.getters[getters.IS_AUTHED];
    },
    appCssClass() {
      return ['app-' + this.$route.name, {authed: this.amIAuthed}];
    },
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-top: 52px;
  padding-left: 180px;

  &.authed {
    @media screen and (max-width: 1024px) {
      padding-left: 0;
      padding-left: 0;
    }
  }

  &.app-welcome,
  &.app-login {
      padding-left: 0;
  }
}
</style>
