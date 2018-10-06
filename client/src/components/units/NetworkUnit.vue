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
      v-for="item in $store.state.home.network.macMap"
      :key="item[1]"
      :name="($store.state.homeSettings.networkCustomNames || {})[item[1]] || item[2]"
      :ip="item[0]"
      :mac="item[1]"
      :editable="true"
      :blur="true"
      @changeName="changeName(item[1], $event)"
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
    changeName(mac, name) {
      this.$store.dispatch(actions.HOME_SETTINGS_SAVE, {
        networkCustomNames: {
          ...this.$store.state.homeSettings.networkCustomNames,
          [mac]: name,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.network-list {
  overflow-x: auto;
  &__titles {
    text-transform: uppercase;
  }
}
</style>