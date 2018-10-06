<template>
<div id="security">

    <!-- Images -->
    <div
		class="images-wrapper"
		v-if="securityState.images"
	>
        <p
            v-if="!securityState.images.length"
            class="no-images"
        >No Images</p>
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

    <div class="columns">
        <!-- BUTTONS -->
        <div class="column">
            <div class="line">
                <button
                    class="button"
                    @click="sendCommand(commandsByKey.takePicture.key)"
                >
                    <span>Take Picture</span>
                </button>
            </div>
            <div class="line">
                <button
                    class="button"
                    @click="sendCommand(commandsByKey.deletePictures.key)"
                >
                    <span>Delete Pictures</span>
                </button>
            </div>
        </div>
        <!-- CHECKBOXES -->
        <div class="column is-two-thirds">
            <div class="line">
                <span>Turn detection ON</span>
                <input
                    class="checkbox checkbox--margin"
                    type="checkbox"
                    v-model="securityState.detectionStatus"
                    @click="sendCommand(commandsByKey.toggleDetection.key)"
                />
            </div>
            <div class="line">
                <span>Turn detection ON when nobody home</span>
                <input
                    class="checkbox checkbox--margin"
                    type="checkbox"
                    v-model="securityState.pirOnWhenNobodyHome"
                    @click="sendCommand(commandsByKey.togglePirWhenNobodyHome.key)"
                />
            </div>
        </div>
    </div>

</div>
</template>

<script>
import {mutations} from '@/store/types';
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
        min-height: 110px;
        text-align: center;
    }
    .images {
        text-align: left;
        // height: 100px;
        white-space: nowrap;
        img {
            margin: 0 5px;
            height: 100px;
            cursor: pointer;
        }
    }
    .line {
        margin-bottom: 7px;
        height: 38px;
        vertical-align: middle;
    }
    .no-images {
        padding-top: 30px;
    }
}
</style>