<template>
  <li class="network-item" v-bind:class="{blur}">
    <editable-content
      class="network-item__name"
      :content="name"
      :trim="true"
      :active="editable"
      @blur="handleChange($event)"
    ></editable-content>
    <span class="network-item__ip">{{ip}}</span>
    <span class="network-item__mac">{{mac}}</span>
  </li>
</template>

<script>
import EditableContent from './EditableContent.vue';

export default {
  name: 'NetworkItem',
  components: {
    EditableContent,
  },
  props: {
    name: String,
    ip: String,
    mac: String,
    editable: Boolean,
    blur: Boolean,
  },
  methods: {
    handleChange(name) {
      this.$emit('changeName', name);
    },
  },
};
</script>

<style lang="scss" scoped>
.network-item {
  display: flex;
  justify-content: space-between;

  span {
    text-align: left;
    padding: 10px 5px;
    flex-grow: 1;
    width: 33%;
  }

  &__name, {
    width: 40%;
    text-overflow: ellipsis;
  }
  &__ip,
  &__mac, {
    width: 30%;
  }

  &.blur .network-item__ip,
  &.blur .network-item__mac, {
    color: transparent;
    text-shadow: #111 0 0 20px;
    user-select:none;
    &:hover,
    &:focus {
      color: inherit;
      text-shadow: none;
      user-select:all;
    }
  }
}
</style>