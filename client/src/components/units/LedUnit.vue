<template>
<div id="led">

	<!-- led connected -->
    <div v-if="ledState !== null">
		<!-- led status -->
		<div class="line">
			<p>LED is: {{ledState ? 'ON' : 'OFF'}}</p>
		</div>

		<!-- toggle led -->
		<div class="line">
			<button
				class="button"
				@click="toggleLed()"
			>
				<span>Turn LED {{ledState ? 'OFF' : 'ON'}}</span>
			</button>
		</div>
	</div>

	<!-- led not connected -->
	<div v-if="ledState === null">
		<p>LED is not connected</p>
	</div>
	
</div>
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

import {mutations} from '@/store/constants';
import deviceCommands from '../../../../common/data/deviceCommands';

export default {
  name: 'LedUnit',
  computed: {
    ledState() {
      return this.$store.state.home.led;
    },
  },
  methods: {
    toggleLed() {
      this.$store.commit(mutations.WS_MESSAGE_SEND, [
        'deviceCommand',
        {
          cmdId: deviceCommands.byKey.setLed.key,
          status: this.ledState ? 0 : 1,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
#led {
    .line {
        margin-bottom: 15px;
    }
}
</style>