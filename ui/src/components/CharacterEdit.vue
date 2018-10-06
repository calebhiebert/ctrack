<template>
  <div class="card monster-bg" :class="{'p-2': expanded, 'p-1 pl-2': !expanded, 'monster-bg': entity.type === 'monster', 'character-bg': entity.type === 'character'}">
    <modal ref="hp-modal" title="Change HP" size="small">
      <hitpoint-editor :current-hitpoints="entity.hitpoints" :max-hitpoints="entity.maxHitpoints" @done="onHpEdit" @kill="onKill" />
      <div slot="footer"></div>
    </modal>

    <modal ref="name-modal" title="Change Name" size="small">
      <name-editor :current-name="entity.name" @done="onNameEdit" />
      <div slot="footer"></div>
    </modal>

    <modal ref="image-modal" title="Change Image" size="small">
      <image-editor @done="onImageEdit" />
      <div slot="footer"></div>
    </modal>

    <!-- Expanded View -->
    <div v-if="expanded">
      <div class="d-flex">
        <div class="mr-2">
          <user-avatar :sub-id="controllerId" :id="entity.name" class="avatar-lg c-hand" @clicked="editImage" :datauri="entity.imageData" />
        </div>
        <div class="expanded">
          <div class="columns">
            <div class="column d-flex">
              <h3>{{ entity.name }}</h3>
              <button class="btn btn-link btn-sm" @click="editName">
                <i class="icon icon-edit"></i>
              </button>
            </div>
            <div class="column is-narrow">
              <button class="btn btn-link btn-sm" @click="sortUp" v-if="orderable === true">
                <i class="icon icon-upward"></i>
              </button>
              <button class="btn btn-link btn-sm" @click="sortDown" v-if="orderable === true">
                <i class="icon icon-downward"></i>
              </button>

              <button class="btn btn-link btn-sm float-right" @click="collapse" v-if="expandable">
                <i class="icon icon-arrow-up" />
              </button>
              <entity-menu :entity="entity" :hide-delete="hideDelete" @delete="deleteEntity" @switch-type="onSwitchType" :hideSaveAsTemplate="hideSaveAsTemplate" :hideSwitchType="hideSwitchType" />
            </div>
          </div>

          <div class="c-hand" @click="editHp">
            <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" :is-monster="entity.type === 'monster'" />
          </div>

          <div class="columns">
            <div class="column">
              Controlled By
              <div class="tile tile-centered" v-for="user of controlledBy" :key="user.id">
                <div class="tile-icon">
                  <user-avatar class="avatar-sm" :id="user.id" />
                </div>
                <div class="tile-content">{{ user.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Collapsed View -->
    <div class="columns" v-else>
      <div class="column pr-0 is-narrow tooltip" data-tooltip="Player Controlled Character" v-if="entity.controllingIds.length > 0">
        <i class="icon icon-people"></i>
      </div>
      <div class="column pr-0 is-narrow">
        <user-avatar :sub-id="controllerId" :id="entity.name" class="avatar-sm c-hand" @clicked="editImage" :datauri="entity.imageData" />
      </div>
      <div class="column col-4 v-center-children">
        <span>{{ entity.name }}</span>
      </div>
      <div class="column center-children">
        <div class="c-hand" style="width: 100%;" @click="editHp">
          <health-meter :hitpoints="entity.hitpoints" :maxHitpoints="entity.maxHitpoints" :is-monster="entity.type === 'monster'" />
        </div>
      </div>
      <div class="column is-narrow">
        <button class="btn btn-link btn-sm" @click="sortUp" v-if="orderable === true">
          <i class="icon icon-upward"></i>
        </button>
        <button class="btn btn-link btn-sm" @click="sortDown" v-if="orderable === true">
          <i class="icon icon-downward"></i>
        </button>
        <entity-menu :entity="entity" :hide-delete="hideDelete" @delete="deleteEntity" @switch-type="onSwitchType" :hideSaveAsTemplate="hideSaveAsTemplate" :hideSwitchType="hideSwitchType" />
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
import UserAvatar from '@/components/UserAvatar.vue';
import NameEditor from '@/components/NameEditor.vue';
import Modal from '@/components/Modal.vue';
import ImageEditor from '@/components/ImageEditor.vue';
import EntityMenu from '@/components/EntityMenu.vue';
import gql from 'graphql-tag';

export default {
  components: {
    HealthMeter,
    HitpointEditor,
    Modal,
    NameEditor,
    UserAvatar,
    ImageEditor,
    EntityMenu
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

    orderable: {
      type: Boolean,
      required: false,
      default: true
    },

    hideSaveAsTemplate: {
      required: false,
      type: Boolean,
      default: false,
    },

    hideSwitchType: {
      required: false,
      type: Boolean,
      default: false
    },

    room: {
      required: true,
      type: Object,
    }
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

    editName() {
      this.$refs['name-modal'].show();
    },

    editImage() {
      this.$refs['image-modal'].show();
    },

    onHpEdit(e) {
      console.log(e);
      this.$refs['hp-modal'].hide();

      this.doEdit({
        hitpoints: e.newHitpoints,
      });
    },

    onSwitchType(type) {
      this.doEdit({
        type
      });
    },

    onImageEdit(e) {
      console.log(e);
      this.$refs['image-modal'].hide();

      this.doEdit({
        imageData: e.dataUri
      })
    },

    sortUp() {
      this.doEdit({
        sort: this.entity.sort - 1,
      });
    },

    sortDown() {
      this.doEdit({
        sort: this.entity.sort + 1,
      });
    },

    onKill() {
      this.$refs['hp-modal'].hide();
      this.deleteEntity();
    },

    onNameEdit(e) {
      console.log(e);
      this.$refs['name-modal'].hide();

      this.doEdit({
        name: e.name,
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

  computed: {
    controlledBy() {
      if (this.entity && this.room && this.room.users) {
        const controlledBy = this.entity.controllingIds.map(id => this.room.users.find(u => u.id === id));
        console.log(controlledBy)
        return controlledBy.filter(u => u !== null && u !== undefined);
      } else {
        return [];
      }
    },

    controllerId() {
      return this.controlledBy.length > 0 ? this.controlledBy[0].id : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.center-children {
	display: flex;
	justify-content: center;
	align-items: center;
}

.v-center-children {
	display: flex;
	align-items: center;
}

.expanded {
	width: 100%;
}

.monster-bg {
	$opac: 0.1;

	background-size: 4rem;
	background-image: linear-gradient(
			to right,
			rgba(226, 3, 55, $opac) 0%,
			rgba(226, 3, 55, $opac) 0%
		),
		url('/img/bg_pattern_1.png');
}

.character-bg {
	background-size: 15rem;
	background-image: url('/img/bg_pattern_0.png');
}
</style>


