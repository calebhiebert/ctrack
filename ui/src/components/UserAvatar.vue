<template>
  <figure class="avatar" @click="$emit('clicked')">
    <img :src="url" alt="Avatar" @click="$emit('clicked')" />
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

    datauri: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    url() {
      if (this.datauri) {
        return this.datauri;
      } else {
        return `https://api.adorable.io/avatars/${this.size}/${this.id}.png`;
      }
    },
  },
};
</script>

