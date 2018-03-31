<template>
<div id="users" class="main-content">
	<!-- list of all users -->
    <user-list></user-list>
    <hr />
	<!-- invite new user if admin -->
	<div v-if="amIAdmin">
		<h4>Invite new user</h4>
		<b-field grouped>
			<b-field>
				<b-input placeholder="Name"
					type="text"
					v-model="newUserName">
				</b-input>
			</b-field>
			<b-field>
				<b-input placeholder="Email"
					type="email"
					v-model="newUserEmail">
				</b-input>
			</b-field>
			<b-field>
				<p class="control">
					<button
						:disabled="!newUserEmail"
						class="button is-primary"
						@click="inviteNewUser()"
					>Invite</button>
				</p>
			</b-field>
		</b-field>
	</div>
</div>
</template>

<script>
import {actions, getters} from '@/store/constants';
import UserList from '@/components/units/UserList.vue';

export default {
    name: 'UsersView',
	components: {UserList},
	data() {
		return {
			newUserEmail: '',
			newUserName: '',
		};
	},
	computed: {
        amIAdmin() {
            return this.$store.getters[getters.AM_I_ADMIN];
        }
    },
    methods: {
        async inviteNewUser() {
			const invited = await this.$store.dispatch(actions.USERS_INVITE, {
				name: this.newUserName,
				email: this.newUserEmail,
			});

			if (invited) {
				this.newUserEmail = '';
				this.newUserName = '';

				this.$toast.open({
					message: `User invited`,
					type: 'is-success',
				});
			} else {
				this.$toast.open({
					message: `Error inviting user`,
					type: 'is-danger',
				});
			}
		},
    },
};
</script>

<style lang="scss" scoped>
#users {
    padding-top: 45px;
}
</style>