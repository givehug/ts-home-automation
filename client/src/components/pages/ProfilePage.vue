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
	<hr />

	<!-- devices mac addresses -->
    <h4 class="title is-5">Associated mac addresses</h4>
    <p
		class="reveal"
		@click="showMacs = !showMacs"
	>{{showMacs ? 'hide' : 'reveal'}}</p>
    <div v-if="showMacs">
        <p
			v-for="mac in $store.state.settings.data.deviceIdentifiers"
			:key="mac"
			class="mac"
		>
            <span>{{mac}}</span>
            <a
				class="del"
				@click="deleteMacAddress(mac)"
			>
                <span class="icon is-medium has-text-danger">
					<i class="fa fa-trash-o fa-lg"></i>
				</span>
            </a>
        </p>
        <p>
            <b-field>
                <b-input
					placeholder="New mac address..."
                    type="text"
                    v-model="newMacAddress"
				></b-input>
                <p class="control">
                    <button
						:disabled="!newMacAddress"
                        class="button is-primary"
                        @click="addNewMacAddress()"
                    >Add</button>
                </p>
            </b-field>
        </p>
    </div>

</div>
</template>

<script>
import {actions} from '@/store/constants';
import EditableContent from '@/components/other/EditableContent.vue';

export default {
	name: 'ProfilePage',

	components: {
        EditableContent,
	},

    data() {
        return {
            showMacs: false,
            newMacAddress: '',
			macToRemove: '',
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

    computed: {
        updatedMacs() {
            return [...this.$store.state.settings.data.deviceIdentifiers, this.newMacAddress];
        },
        macsToRemove() {
            return this.$store.state.settings.data.deviceIdentifiers.filter(m => m !== this.macToRemove);
        },
	},

    methods: {
        addNewMacAddress() {
            if (!this.newMacAddress) {
                return;
            }

            this.$store.dispatch(actions.SETTINGS_SAVE, {deviceIdentifiers: this.updatedMacs});
            this.newMacAddress = '';
        },
        deleteMacAddress(mac) {
            this.macToRemove = mac;
            this.$store.dispatch(actions.SETTINGS_SAVE, {deviceIdentifiers: this.macsToRemove});
            this.macToRemove = '';
		},
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
    .mac {
        .del {
            opacity: 0;
            visibility: hidden;
            transition: .2s;
            margin-left: 15px;
            position: relative;
            top: -2px;
        }

        &:hover {
            .del {
                opacity: 0.6;
                visibility: visible;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>