<template>
  <div class="card p-2">
    
    <!-- Expanded View -->
    <div v-if="expanded">
      <button class="btn btn-link btn-sm float-right" @click="collapse">
        <i class="icon icon-arrow-up" /> 
      </button>
      <button class="btn btn-link btn-sm float-right" @click="deleteEntity" v-if="hideDelete !== true">
        <i class="icon icon-cross" /> 
      </button>
      <h3>{{ entity.name }}</h3>
      <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" />
    </div>

    <!-- Collapsed View -->
    <div class="columns" v-else>
      <div class="column is-narrow">
        <span>{{ entity.name }}</span>
      </div>
      <div class="column">
        <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" />
      </div>
      <div class="column is-narrow">
        <button class="btn btn-link btn-sm float-right" @click="expand">
          <i class="icon icon-arrow-down" /> 
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import HealthMeter from '@/components/HealthMeter.vue';
import gql from 'graphql-tag';

export default {
  components: {
    HealthMeter,
  },

  props: {
    entity: {
      type: Object,
      required: true,
    },

    hideDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
    };
  },

  async created() {},

  methods: {
    async deleteEntity() {
      const result = await this.$swal({
        type: 'question',
        title: 'Are you sure?',
        text: 'You cannot undo this',
        showCancelButton: true,
      });

      if (result.value === true) {
        // Do Delete
        const deleteResult = await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteEntity($roomId: ID!, $entityId: ID!) {
              removeEntity(roomId: $roomId, entityId: $entityId)
            }
          `,

          variables: {
            roomId: this.$route.params.id,
            entityId: this.entity.id,
          },
        });

        console.log(deleteResult);
      }
    },

    expand() {
      this.expanded = true;
    },

    collapse() {
      this.expanded = false;
    },

    toggleExpand() {
      if (this.expanded) {
        this.collapse();
      } else {
        this.expand();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.meter {
  transition: all 0.25s;
}
</style>


