<template>
  <div class="card" :class="{'p-2': expanded, 'p-1 pl-2': !expanded}">
    <modal ref="hp-modal" title="Change HP" size="small">
      <hitpoint-editor :current-hitpoints="entity.hitpoints" :max-hitpoints="entity.maxHitpoints" @done="onHpEdit" />
      <div slot="footer"></div>
    </modal>
    <!-- Expanded View -->
    <div v-if="expanded">
      <div class="columns">
        <div class="column">
          <h3>{{ entity.name }}</h3>
        </div>
        <div class="column is-narrow">
          <button class="btn btn-link btn-sm" @click="deleteEntity" v-if="hideDelete !== true">
            <i class="icon icon-cross" /> 
          </button>
          <button class="btn btn-link btn-sm" @click="collapse" v-if="expandable">
            <i class="icon icon-arrow-up" /> 
          </button>
        </div>
      </div>

      <div class="c-hand" @click="editHp">
        <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" />
      </div>
    </div>

    <!-- Collapsed View -->
    <div class="columns" v-else>
      <div class="column is-narrow center-children">
        <span>{{ entity.name }}</span>
      </div>
      <div class="column center-children">
        <div class="c-hand" style="width: 100%;" @click="editHp">
          <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" />
        </div>
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
import HitpointEditor from '@/components/HitpointEditor.vue';
import Modal from '@/components/Modal.vue';
import gql from 'graphql-tag';

export default {
  components: {
    HealthMeter,
    HitpointEditor,
    Modal,
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

    expandable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      expanded: this.expandable ? false : true,
    };
  },

  async mouted() {
    console.log(this.$refs);
  },

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

    editHp() {
      this.$refs['hp-modal'].show();
    },

    onHpEdit(e) {
      console.log(e);
      this.$refs['hp-modal'].hide();

      this.doEdit({
        hitpoints: e.newHitpoints,
      });
    },

    doEdit(editInput) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation ChangeEntity($rid: ID!, $eid: ID!, $input: ModifyEntityInput!) {
            changeEntity(roomId: $rid, entityId: $eid, input: $input) {
              id
              name
            }
          }
        `,

        variables: {
          rid: this.$route.params.id,
          eid: this.entity.id,
          input: editInput,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.center-children {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


