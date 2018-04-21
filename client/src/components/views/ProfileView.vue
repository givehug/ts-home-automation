<template>
<div id="profile" class="main-content">

	<!-- save button -->
	<button
		v-if="changed"
		class="button is-primary button-save"
		@click="saveUserData()"
	>Save</button>

	<!-- name -->
  <h4 class="title is-5">Name</h4>
    <p><editable-content
      :content="userData.name"
      :trim="true"
      @blur="handleChange({name: $event})"
    ></editable-content></p>
  <hr />

	<!-- email -->
  <h4 class="title is-5">Email</h4>
    <p><editable-content
      :content="userData.email"
      :trim="true"
      @blur="handleChange({email: $event})"
    ></editable-content></p>
  <hr />

	<!-- password -->
	<h4 class="title is-5">Change Password</h4>
	<b-field grouped>
		<b-field><b-input
			placeholder="New Password"
			type="password"
			@blur="handleChange({'password': $event.target.value})"
			v-model="userData.password"
		></b-input></b-field>
		<b-field><b-input
			placeholder="Confirm Password"
			type="password"
			@blur="handleChange({'confirmPassword': $event.target.value})"
			v-model="userData.confirmPassword"
		></b-input></b-field>
		<b-field><b-input
			placeholder="Old Password"
			type="password"
			@blur="handleChange({'oldPassword': $event.target.value})"
			v-model="userData.oldPassword"
		></b-input></b-field>
	</b-field>

</div>
</template>

<script>import EditableContent from '@/components/other/EditableContent.vue';
import {actions} from '@/store/types';

export default {
  name: 'ProfileView',

  components: {
    EditableContent,
  },
  data() {
    return {
      changed: false,
      userData: {
        name: this.$store.state.user.data.name,
        email: this.$store.state.user.data.email,
        password: '',
        confirmPassword: '',
        oldPassword: '',
      },
    };
  },
  methods: {

    handleChange(update) {
      // apply changes to userData
      Object.assign(this.userData, update);

      this.checkUserDataChange();
    },
    checkUserDataChange() {
      // check if some user data prop has changes
      this.changed = this.userData.name !== this.$store.state.user.data.name
        || this.userData.email !== this.$store.state.user.data.email
        || this.userData.password
          && this.userData.confirmPassword
          && this.userData.oldPassword;
    },
    resetUserData() {
      this.userData = {
        name: this.$store.state.user.data.name,
        email: this.$store.state.user.data.email,
        password: '',
        confirmPassword: '',
        oldPassword: '',
      };
    },
    async saveUserData() {
      const updated = await this.$store.dispatch(actions.USER_DATA_PATCH, this.userData);

      if (updated) {
        this.$toast.open({
          message: `User data updated`,
          type: 'is-success',
        });

        this.resetUserData();
        this.checkUserDataChange();
      } else {
        this.$toast.open({
          message: `Update failed`,
          type: 'is-danger',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#profile {
	position: relative;

	h4 {
		margin-bottom: 10px;
	}
	
	.button-save{
		position: absolute;
		top: 30px;
		right: 30px;
	}
    p + p {
        margin-top: 20px;
    }
    .reveal {
        font-style: italic;
        text-transform: uppercase;
        font-weight: bold;
        color: grey;
        margin-bottom: 20px;
        cursor: pointer;
    }
}
</style>