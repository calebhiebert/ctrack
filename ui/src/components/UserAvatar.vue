<template>
  <figure class="avatar">
    <img :src="url" alt="Avatar" />
  </figure>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: false,
      default: 'default',
    },

    size: {
      type: Number,
      required: false,
      default: 64,
    },
  },

  computed: {
    url() {
      return `https://api.adorable.io/avatars/${this.size}/${this.id}.png`;
    },
  },
};
</script>

