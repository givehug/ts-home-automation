<template>
<div
	id="device-list"
	class="main-content"
>
	<!-- header -->
	<div class="columns is-multiline">
		<div class="column">
			<button
				class="button"
				@click="addNewDevice()"
			>
				<span class="icon">
					<i class="fa fa-plus"></i>
				</span>
				<span>Add device</span>
			</button>
		</div>
	</div>

    <div class="columns is-multiline">
		<!-- cards -->
        <div
			class="column is-half-tablet is-one-third-desktop"
			v-for="device in $store.state.devices.map"
			:key="device._id"
		>
            <device-card
				:device="device"
				@changed="handleDeviceChange(device._id, $event)"
				@deleted="handleDeviceDelete(device._id)"
			></device-card>
        </div>
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

import DeviceCard from '@/components/devices/DeviceCard.vue';
import {actions} from '@/store/constants';

export default {
  name: 'DevicesView',
  components: {DeviceCard},

  methods: {
    async addNewDevice() {
      try {
        await this.$store.dispatch(actions.DEVICES_ADD);

        this.$toast.open({
          message: 'New device added',
          type: 'is-success',
        });
      } catch (error) {
        this.$toast.open({
          message: 'Error adding new device',
          type: 'is-danger',
        });
      }
    },

    async handleDeviceChange(deviceId, update) {
      const deviceData = {...this.$store.state.devices.map[deviceId],
                          ...update,
      };

      try {
        await this.$store.dispatch(actions.DEVICES_SAVE, deviceData);

        this.$toast.open({
          message: 'Device saved',
          type: 'is-success',
        });
      } catch (error) {
        this.$toast.open({
          message: 'Error saving device',
          type: 'is-danger',
        });
      }
    },

    handleDeviceDelete(deviceId) {
      this.$dialog.confirm({
        title: 'Deleting device',
        message: 'Are you sure you want to delete this device?',
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.$store.dispatch(actions.DEVICES_DELETE, deviceId);

            this.$toast.open({
              message: `Device deleted`,
              type: 'is-success',
            });
          } catch (error) {
            this.$toast.open({
              message: 'Error deleting device',
              type: 'is-danger',
            });
          }
        },
      });
    },
  },
};
</script>