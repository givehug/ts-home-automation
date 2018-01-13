<template>
<aside class="menu sidebar">
	<ul class="menu-list">
		<li>
			<router-link to="/dashboard">
				<span class="icon">
					<i class="fa fa-tachometer"></i>
				</span>
				<span>Dashboard</span>
			</router-link>
		</li>
		<li>
			<router-link to="/devices">
				<span class="icon">
					<i class="fa fa-puzzle-piece"></i>
				</span>
				<span>Devices</span>
			</router-link>
		</li>
		<li>
			<router-link to="/users">
				<span class="icon">
					<i class="fa fa-users"></i>
				</span>
				<span>Users</span>
			</router-link>
		</li>
	</ul>
</aside>
</template>

<script>
export default {
	name: 'SidebarLayout',
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