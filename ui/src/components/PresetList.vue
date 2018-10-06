<template>
  <div>
    <preset-list-item class="mt-1" :preset="preset" v-for="preset of presets" :key="preset.id" @spawn="spawn" @delete="remove" />
  </div>
</template>
<script>
import Avatar from '@/components/UserAvatar.vue';
import PresetListItem from '@/components/PresetListItem.vue';

export default {
  components: {
    Avatar,
    PresetListItem,
  },

  props: {
    presets: {
      type: Array,
      required: true,
    }
  },

  methods: {
    spawn(e) {
      this.$emit('spawn', e);
    },

    remove(e) {
      this.$emit('delete', e);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.selectable:hover {
	background-color: $secondary-color !important;
}

.bordered {
	background: $bg-color-light;
	border: $border-width solid $border-color;
	border-radius: $border-radius;
}
</style>
