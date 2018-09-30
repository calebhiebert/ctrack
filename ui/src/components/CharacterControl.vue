<template>
  <div class="card p-2" @click="updateHp">
    <h3>Hof</h3>
    <health-meter :hitpoints="hp" :maxHitpoints="200" />
  </div>
</template>
<script>
import HealthMeter from '@/components/HealthMeter.vue';
import gql from 'graphql-tag';

export default {
  components: {
    HealthMeter
  },

  data() {
    return {
      hp: Math.random() * 200
    }
  },

  async created() {
    const ent = await this.$apollo.mutate({
      mutation: gql`
        mutation AddEntity($roomId: ID!, $input: AddEntityInput!) {
          addEntity(roomId: $roomId, input: $input) {
            id
            type
            name
            controllingIds
            hitpoints
            maxHitpoints
          }
        }
      `,

      variables: {
        roomId: this.$route.params.id,
        input: {
          type: 'character',
          name: 'Hof',
          maxHitpoints: 100
        }
      }
    });

    console.log(ent);
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


