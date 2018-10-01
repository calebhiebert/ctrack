<template>
  <div 
    :class="{active: open, 'modal-sm': size === 'small', 'modal-lg': size === 'large'}"
    class="modal">
    <a 
      href="#close" 
      class="modal-overlay" 
      aria-label="Close"
      @click="close('background')" />
    <div class="modal-container">
      <div class="modal-header pb-0">
        <slot name="header">
          <a 
            href="#close" 
            class="btn btn-clear float-right" 
            aria-label="Close" 
            @click="close('close')" />
          <div class="modal-title h5">{{ title }}</div>
        </slot>
      </div>
      <div class="modal-body py-0">
        <div class="content" v-if="open">
          <slot />
        </div>
      </div>
      <div class="modal-footer py-0">
        <slot name="footer">
          <button 
            class="btn btn-primary" 
            @click="close('ok')">OK</button>
          <button 
            class="btn btn-primary ml-1" 
            @click="close('cancel')">Cancel</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Modal',
    },
    size: {
      type: String,
      required: false,
      default: 'none',
    },
  },

  data() {
    return {
      open: false,
      keylistener: (e) => {
        if (e.keyCode === 27) {
          this.close('escape');
        }
      },
    };
  },

  methods: {
    close(reason) {
      this.hide();
      this.$emit('close', { reason });
    },

    hide() {
      this.open = false;
      document.onkeyup = null;
    },

    show() {
      this.open = true;
      document.onkeyup = this.keylistener;
    },
  },
};
</script>

