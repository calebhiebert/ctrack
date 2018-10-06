<template>
  <figure class="avatar noselect" @click="$emit('clicked')">
    <img class="noselect" :src="url" alt="Avatar" @click="$emit('clicked')" />
    <img :src="subUrl" class="noselect avatar-icon" alt="Controlling Party" v-if="subId !== ''" />
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

    subId: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    url() {
      if (this.datauri) {
        return this.datauri;
      } else {
        return `https://api.adorable.io/avatars/${this.size}/${this.id}.png`;
      }
    },

    subUrl() {
      return `https://api.adorable.io/avatars/${this.size}/${this.subId}.png`;
    }
  },
};
</script>

