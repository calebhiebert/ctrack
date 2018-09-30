<template>
  <div class="bar">
    <div class="bar-item" :style="{width: barWidth}">{{ hitpoints.toFixed(0) }}/{{ maxHitpoints }}</div>
  </div>
</template>
<script>
export default {
  props: {
    hitpoints: {
      type: Number,
      required: true,
    },

    maxHitpoints: {
      type: Number,
      required: true
    }
  },

  computed: {
    barWidth() {
      return (this.hitpoints / this.maxHitpoints * 100).toFixed(0) + '%'
    },

    optimum() {
      return this.maxHitpoints * 0.8
    },

    low() {
      return this.maxHitpoints * 0.3;
    },
    
    high() {
      return this.maxHitpoints * 0.6
    }
  }
}
</script>
