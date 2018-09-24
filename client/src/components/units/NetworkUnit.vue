<template>
  <ul class="network-list">
    <network-item
      class="network-list__titles"
      name="name"
      ip="ip"
      mac="mac"
      :editable="false"
    ></network-item>
    <network-item
      v-for="mac in $store.state.home.network.macMap"
      :key="mac[1]"
      :name="($store.state.settings.data.networkCustomNames || {})[mac[0]] || mac[2]"
      :ip="mac[0]"
      :mac="mac[1]"
      :editable="true"
      :blur="true"
      @changeName="changeName(mac[0], $event)"
    ></network-item>
  </ul>
</template>

<script>
import NetworkItem from '@/components/other/NetworkItem.vue';
import {actions} from '@/store/types';

export default {
  name: 'NetworkUnit',
  components: {
    NetworkItem,
  },
  data() {
    return {
        showNetwork: true,
    };
  },
  methods: {
    changeName(ip, name) {
      this.$store.dispatch(actions.SETTINGS_SAVE, {networkCustomNames: {
        ...this.$store.state.settings.data.networkCustomNames,
        [ip]: name,
      }});
    },
  },
};
</script>

<style lang="scss" scoped>
.network-list {
  &__titles {
    text-transform: uppercase;
  }
}
</style>