<template>
<div
	id="settings"
	v-if="$store.state.app.dataLoaded"
	class="main-content"
>
    <h4 class="title is-5">Robo</h4>
    <b-switch
		:value="$store.state.settings.data.annyangActive"
		@input="toggleActive()"
	>{{$store.state.settings.data.annyangActive ? 'Active' : 'Inactive'}}</b-switch>
	<hr>

	<h4 class="title is-5">Notify By Email On New Motion Detection</h4>
    <b-switch
		:value="$store.state.settings.data.notifyOnMotionDetection"
		@input="toggleMotionNotification()"
	>{{$store.state.settings.data.notifyOnMotionDetection ? 'Yes' : 'No'}}</b-switch>
	<hr>

	<!-- devices mac addresses -->
    <h4 class="title is-5">Associated devices mac addresses</h4>
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

export default {
	name: 'SettingsView',
	data() {
		return {
			showMacs: false,
			newMacAddress: '',
			macToRemove: '',
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
		toggleActive() {
			this.$store.dispatch(actions.ROBO_TOGGLE);
		},
		toggleMotionNotification() {
			this.$store.dispatch(actions.SETTINGS_SAVE, {
				notifyOnMotionDetection: !this.$store.state.settings.data.notifyOnMotionDetection,
			});
		},
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
	}
};
</script>


<style lang="scss" scoped>
#settings {
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