<template>
  <div class="card">
    <!-- header -->
    <header class="card-header">
      <p class="card-header-title">
        <editable-content
          :content="device.name"
          @blur="handleChange({name: $event})"
        ></editable-content>
      </p>
      <a class="card-header-icon">
        <span
          class="icon is-medium"
          :class="{'has-text-success': isDeviceActive, 'has-text-danger': !isDeviceActive}"
        >
          <i class="fa fa-lightbulb-o fa-lg"></i>
        </span>
      </a>
    </header>
    <!-- body -->
    <div class="card-content">
      <div class="content">
        <p><strong>id:</strong> {{device._id}}</p>
        <p><editable-content
          :content="device.description"
          @blur="handleChange({description: $event})"
        ></editable-content></p>
      </div>
    </div>
    <!-- footer -->
    <footer class="card-footer">
      <a
        href=""
        @click="handleDelete($event, device._id)"
        class="card-footer-item"
      >
        <span class="icon is-medium has-text-danger">
          <i class="fa fa-trash-o fa-lg"></i>
        </span>
      </a>
    </footer>
  </div>
</template>

<script>
import EditableContent from '@/components/other/EditableContent.vue';
import {getters} from '@/store/types';

export default {
  name: 'DeviceCard',
  props: {
    device: Object,
    changed: Function,
    deleted: Function,
  },
  components: {
    EditableContent,
  },
  computed: {
    isDeviceActive() {
      return this.$store.getters[getters.IS_DEVICE_ACTIVE](this.device._id);
    },
  },
  methods: {
    handleChange(update) {
      this.$emit('changed', update);
    },
    handleDelete(e) {
      e.preventDefault();
      this.$emit('deleted');
    },
  },
};
</script>

<style lang="scss" scoped>
.deviceCard {
  margin-bottom: 20px;

  .card-header {
    background-color: #f2dede;
    border-color: #ebcccc;
    color: #a94442;

    h4 {
      margin-bottom: 0;
    }
  }

  &.active {
    .card-header {
      background-color: #dff0d8;
      border-color: #d0e9c6;
      color: #3c763d;
    }
  }
}
</style>