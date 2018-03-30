<template>
<div id="security">

    <!-- Images -->
    <div
		class="images-wrapper"
		v-if="securityState.images"
	>
        <p v-if="!securityState.images.length">No Images</p>
        <div
			v-if="securityState.images.length"
			class="images"
		>
            <img
                v-for="(image, index) in securityState.images"
                :src="'data:image/png;base64,' + image"
                :key="index"
                @click="imageToShow = image"
            />
        </div>
    </div>

    <!-- Images Lightshot -->
	<b-modal :active.sync="imageToShow">
		<p class="image">
            <img :src="'data:image/png;base64,' + imageToShow">
        </p>
	</b-modal>

    <!-- Last detected -->
    <div
		v-if="securityState"
		class="line"
	>
        <p>Last detected: {{securityState.lastDetected | time}}</p>
    </div>

	<div class="line">
		<!-- take picture -->
		<button
			class="button button--margin"
			@click="sendCommand(commandsByKey.takePicture.key)"
		>
			<span>Take Picture</span>
		</button>

		<!-- delete picture -->
		<button
			class="button button--margin"
			@click="sendCommand(commandsByKey.deletePictures.key)"
		>
			<span>Delete Pictures</span>
		</button>
	</div>

	<!-- toggle detection -->
	<div class="line">
		<span>Turn detection ON</span>
		<input
			class="checkbox checkbox--margin"
			type="checkbox"
			v-model="securityState.detectionStatus"
			@click="sendCommand(commandsByKey.toggleDetection.key)"
		/>
	</div>

	<!-- toggle nobody home -->
	<div class="line">
		<span>Turn detection ON when nobody home</span>
		<input
			class="checkbox checkbox--margin"
			type="checkbox"
			v-model="securityState.turnDetectionOnWhenNobodyHome"
			@click="sendCommand(commandsByKey.toggleDetectionWhenNobodyHome.key)"
		/>
	</div>
	
</div>
</template>

<script>
import {mutations} from '@/store/constants';
import deviceCommands from '../../../../common/data/deviceCommands';

export default {
    name: 'SecurityUnit',
    data() {
        return {
			imageToShow: false,
			commandsByKey: deviceCommands.byKey,
        };
    },
    computed: {
		securityState() {
			return this.$store.state.home.security;
		},
    },
    methods: {
        sendCommand(cmd) {
            this.$store.commit(mutations.WS_MESSAGE_SEND, [
				'deviceCommand',
				{cmdId: cmd},
			]);
        },
    },
};
</script>

<style lang="scss" scoped>
#security {
    .images-wrapper {
        overflow-y: auto;
        margin-bottom: 15px;
        min-height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .images {
        text-align: left;
        height: 100px;
        white-space: nowrap;

        img {
            margin: 0 5px;
            height: 100px;
            cursor: pointer;
        }
    }
    .line {
        margin-bottom: 15px;
    }
}
</style>