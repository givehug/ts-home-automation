<template>
<div class="main-content">
    <div id="login">
        <div class="box">
            <form v-on:submit="onLoginFormSubmit">
                <b-field :type="loginError ? 'is-danger' : ''">
                    <b-input
                        placeholder="Email"
                        type="email"
                        v-model="loginForm.email"
                        required
                    ></b-input>
                </b-field>
                <b-field :type="loginError ? 'is-danger' : ''">
                    <b-input
                        placeholder="Password"
                        type="password"
                        v-model="loginForm.password"
                        required
                    ></b-input>
                </b-field>
                <button
					class="button is-primary"
					type="submit"
				>Login</button> 
            </form>
        </div>
    </div>
</div>
</template>

<script>
import router from '@/router';
import {actions} from '@/store/constants';

export default {
	name: 'LoginView',
	data() {
		return {
			loginForm: {
				email: '',
				password: '',
			},
			loginError: false,
		};
	},
	methods: {
		async onLoginFormSubmit(e) {
			e.preventDefault();
			const logged = await this.$store.dispatch(actions.USER_LOGIN, this.loginForm);

			if (logged) {
				router.push('/');
			} else {
				this.loginError = true;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
#login {
    max-width: 400px;
    margin: 40px auto;
}
.form-control-error {
    border-color: red;
}
</style>