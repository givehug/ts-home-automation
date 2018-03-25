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
</div>
</template>

<script>
import {actions} from '@/store/constants';

export default {
    name: 'SettingsPage',
    methods: {
        toggleActive() {
            this.$store.dispatch(actions.ROBO_TOGGLE);
		},
		toggleMotionNotification() {
            this.$store.dispatch(actions.SETTINGS_SAVE, {
				notifyOnMotionDetection: !this.$store.state.settings.data.notifyOnMotionDetection,
			});
        },
    }
};
</script>