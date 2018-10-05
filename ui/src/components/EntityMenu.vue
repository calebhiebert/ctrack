<template>
  <div class="dropdown dropdown-right">
    <button class="btn btn-link btn-sm dropdown-toggle" tabindex="0">
      <i class="icon icon-more-vert"></i>
    </button>
    <ul class="menu">
      <li class="menu-item c-hand" @click="deleteEntity" v-if="hideDelete !== true">
        <a>
          <i class="icon icon-cross"></i>
          Delete
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    hideDelete: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  methods: {
    deleteEntity() {
      this.$emit('delete');
    }
  }
}
</script>

