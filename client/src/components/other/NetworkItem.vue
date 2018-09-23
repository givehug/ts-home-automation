<template>
  <li  class="network-item">
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
}
</style>