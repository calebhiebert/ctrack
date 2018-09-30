<template>
  <div class="card p-2" @click="updateHp">
    <h3>Hof</h3>
    <health-meter :hitpoints="hp" :maxHitpoints="200" />
  </div>
</template>
<script>
import HealthMeter from '@/components/HealthMeter.vue';

export default {
  components: {
    HealthMeter
  },

  data() {
    return {
      hp: Math.random() * 200
    }
  },

  methods: {
    updateHp() {
      this.hp = Math.random() * 200
    }
  }
}
</script>

<style lang="scss" scoped>
.meter {
	transition: all 0.25s;
}
</style>


