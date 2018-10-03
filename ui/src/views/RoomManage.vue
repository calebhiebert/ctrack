<template>
  <div class="container" v-if="!$apollo.loading">
    <modal ref="export-modal">
      <entity-export-view :room-id="$route.params.id" />
      <div slot="footer">
        <button class="btn btn-primary" @click="$refs['export-modal'].hide()">
          OK
        </button>
      </div>
    </modal>

    <div class="columns">
      <div class="column col-3">
        <ul class="menu">
          <li class="text-center menu-item" @click="copyLink">
            <h2 class="swell">
              {{ room.id }}
              <i class="icon icon-link"></i>
            </h2>
          </li>
          <li class="divider" data-content="Toolbox" />
          <li class="menu-item" @click="addCharacter">
            <a>
              <i class="icon icon-plus"></i>
              Add Character
            </a>
          </li>
          <li class="menu-item" @click="addMonster">
            <a>
              <i class="icon icon-plus"></i>
              Add Monster
            </a>
          </li>
          <li class="menu-item" @click="showExportModal">
            <a>
              <i class="icon icon-download"></i>
              Export Character Data
            </a>
          </li>
          <li class="menu-item">
            <a>
              <i class="icon icon-upload"></i>
              Import Character Data
            </a>
          </li>
          <li class="menu-item" @click="expandAll">
            <a>
              <i class="icon icon-resize-vert"></i>
              Expand All
            </a>
          </li>
          <li class="menu-item" @click="collapseAll">
            <a>
              <i class="icon icon-resize-horiz"></i>
              Collapse All
            </a>
          </li>
          <li class="menu-item">
            <a>
              <i class="icon icon-search"></i>
              <span v-if="!room.monsterHpHidden"> Hide Monster HP</span>
              <span v-else> Show Monster HP</span>
            </a>
          </li>
          <li class="divider" data-content="Users" />
          <li class="menu-item" v-for="user of room.users" :key="user.id">
            <user-tile :user="user" />
          </li>
        </ul>
      </div>
      <div class="column">
        <div class="empty" v-if="sortedEntities.length === 0">
          <div class="empty-icon">
            <i class="icon icon-search"></i>
          </div>
          <div class="empty-title h5">
            This room is empty right now!
          </div>
          <div class="empty-subtitle">
            Create some new characters/monsters to get started
          </div>
        </div>
        <div class="divider text-center" data-content="Users"></div>
        <character-edit class="mt-2" :ref="`ent-${entity.id}`" :entity="entity" v-for="entity in sortedEntities" :key="entity.id" v-if="entity.type === 'character'" />

        <div class="divider text-center" data-content="Monsters"></div>
        <character-edit class="mt-2" :ref="`ent-${entity.id}`" :entity="entity" v-for="entity in sortedEntities" :key="entity.id" v-if="entity.type === 'monster'" />
      </div>
    </div>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import CharacterEdit from '@/components/CharacterEdit.vue';
import UserTile from '@/components/UserTile.vue';
import Modal from '@/components/Modal.vue';
import EntityExportView from '@/components/EntityExportView.vue';

export default {
  components: {
    CharacterEdit,
    UserTile,
    Modal,
    EntityExportView,
  },

  methods: {
    expandAll() {
      Object.keys(this.$refs).forEach((k) => {
        if (k.startsWith('ent-') && this.$refs[k][0]) {
          this.$refs[k][0].expand();
        }
      });
    },

    collapseAll() {
      Object.keys(this.$refs).forEach((k) => {
        if (k.startsWith('ent-') && this.$refs[k][0]) {
          this.$refs[k][0].collapse();
        }
      });
    },

    showExportModal() {
      this.$refs['export-modal'].show();
    },

    async addCharacter() {
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
            name: 'Unnamed Character',
            maxHitpoints: 150,
          },
        },
      });

      console.log(ent);
    },

    async addMonster() {
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
            type: 'monster',
            name: 'Unnamed Monster',
            maxHitpoints: 150,
          },
        },
      });

      console.log(ent);
    },

    async copyLink() {
      await navigator.clipboard.writeText(`${location.protocol}//${location.host}/room/${this.room.id}`);
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        type: 'success',
        title: 'Link copied to clipboard',
      });
    },

    async toggleMonsterHpVisibility() {
      
    }
  },

  computed: {
    sortedEntities() {
      if (this.room) {
        return this.room.entities.splice(0).sort((a, b) => a.sort - b.sort);
      }

      return [];
    },
  },

  apollo: {
    room: {
      query: gql`
        query GetRoom($id: ID!) {
          room(id: $id) {
            id
            name
            monsterHpHidden
            users {
              id
              name
            }
            masters {
              id
              name
            }
            entities {
              id
              type
              name
              controllingIds
              hitpoints
              maxHitpoints
              sort
              imageData
            }
          }
        }
      `,

      variables() {
        return {
          id: this.$route.params.id,
        };
      },

      subscribeToMore: {
        document: gql`
          subscription RoomStateUpdates($id: ID!) {
            room(id: $id) {
              id
              name
              monsterHpHidden
              users {
                id
                name
              }
              masters {
                id
                name
              }
              entities {
                id
                type
                name
                controllingIds
                hitpoints
                maxHitpoints
                sort
                imageData
              }
            }
          }
        `,

        variables() {
          return {
            id: this.$route.params.id,
          };
        },

        updateQuery: (previous, newData) => {
          console.log('SUB', previous, newData);
        },
      },

      result(res) {
        console.log(res);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

$scale-factor: 1.5;

.menu-item {
	cursor: pointer !important;
}

.swell {
	transition: all 0.25s;
}

.swell:hover {
	font-size: 1.7rem;
	color: $primary-color;
}
</style>
