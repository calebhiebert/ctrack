<template>
  <div>
    <div class="bordered mt-1 p-2 tile selectable tile-centered c-hand" v-for="user of users" :key="user.id" @click="selected(user)">
      <div class="tile-icon">
        <user-avatar class="avatar-sm" :id="user.id" />
      </div>
      <div class="tile-content">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>
<script>
import UserAvatar from '@/components/UserAvatar.vue';

export default {
  components: {
    UserAvatar
  },
  props: {
    users: {
      type: Array,
      required: true,
    }
  },

  methods: {
    selected(user) {
      this.$emit('user-selected', user);
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
