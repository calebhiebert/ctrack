<template>
  <div class="bar noselect" :class="{'bar-sm': barSize === 'small'}">
    <!-- Large Bar -->
    <div class="bar-item noselect" :data-tooltip="tooltipText" :class="[hpClass, amountHidden ? '' : 'tooltip']" :style="{width: barWidth}" v-if="barSize === 'large'">
      <span v-if="!amountHidden">{{ hitpoints.toFixed(0) }}/{{ maxHitpoints }}</span>
    </div>

    <!-- Small bar -->
    <div class="bar-item noselect tooltip" :data-tooltip="tooltipText" :class="[hpClass]" :style="{width: barWidth}" v-else></div>
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
      required: true,
    },

    barSize: {
      type: String,
      required: false,
      default: 'large',
    },

    isMonster: {
      type: Boolean,
      required: false,
      default: false,
    },

    amountHidden: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    barWidth() {
      return this.hpPercent + '%';
    },

    hpPercent() {
      return ((this.hitpoints / this.maxHitpoints) * 100).toFixed(0);
    },

    hpClass() {
      if (this.isMonster) {
        return 'hp-monster';
      }

      if (this.hpPercent >= 65) {
        return 'hp-high';
      } else if (this.hpPercent < 65 && this.hpPercent >= 30) {
        return 'hp-med';
      } else if (this.hpPercent < 30) {
        return 'hp-low';
      }
    },

    tooltipText() {
      return `${this.hitpoints}/${this.maxHitpoints}\n${this.barWidth}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.hp-high {
	background-color: $success-color !important;
}

.hp-med {
	background-color: $warning-color !important;
}

.hp-low {
	background-color: $error-color !important;
}

.hp-monster {
	background-color: $error-color !important;
}

.bar-item {
	transition-timing-function: ease-in-out;
	transition: width 0.4s;
}

.bar {
	background-color: #a0a0a036 !important;
}
</style>

