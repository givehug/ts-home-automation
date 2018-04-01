<template>
<aside class="menu sidebar">
	<ul class="menu-list">
		<li
			v-for="link in links"
			:key="link.name"
		>
			<router-link :to="'/' + link.name">
				<span class="icon">
					<i :class="'fa ' + link.icon"></i>
				</span>
				<span>{{link.name | capitalize}}</span>
			</router-link>
		</li>
	</ul>
</aside>
</template>

<script>
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export default {
  name: 'SidebarLayout',
  data() {
    return {
      links: [{
        name: 'dashboard',
        icon: 'fa-tachometer',
      }, {
        name: 'devices',
        icon: 'fa-puzzle-piece',
      }, {
        name: 'users',
        icon: 'fa-users',
      }, {
        name: 'settings',
        icon: 'fa-cog',
      }],
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
	flex: 0 0 180px;
	padding: 15px;

	.icon {
		margin-right: 10px;
		vertical-align: middle;
	}
	span {
		vertical-align: middle;
	}

	@media screen and (max-width: 999px) {
		display: none;
	}
}
</style>