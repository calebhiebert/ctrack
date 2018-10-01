<template>
  <div class="tile tile-centered">
    <div class="tile-icon">
      <user-avatar class="avatar-md" :id="user.id" />
    </div>
    <div class="tile-content">{{ user.name }}</div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue';

export default {
  components: {
    UserAvatar,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

