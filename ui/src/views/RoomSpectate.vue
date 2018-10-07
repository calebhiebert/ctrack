<template>
  <div class="container" v-if="!$apollo.loading">
    <div class="columns">
      <div class="column col-3">
        <ul class="menu">
          <li class="text-center menu-item" @click="copyLink">
            <h2 class="swell">
              {{ room.id }}
              <i class="icon icon-link"></i>
            </h2>
          </li>
          <li class="divider" data-content="Users" />
          <li class="menu-item" v-for="user of room.users" :key="user.id">
            <user-tile :user="user" :is-master="isMaster(user)" />
          </li>
        </ul>
      </div>
      <div class="column">
        <div class="empty" v-if="room.entities.length === 0">
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
        <div class="divider text-center" data-content="Users" v-if="sortedCharacters.length > 0"></div>
        <transition-group name="list" tag="div">
          <character-edit class="mt-2" :ref="`ent-${entity.id}`" :room="room" :entity="entity" v-for="entity in sortedCharacters" :key="entity.id" :disable-controls="true" />
        </transition-group>

        <div class="divider text-center" data-content="Monsters" v-if="sortedMonsters.length > 0"></div>
        <transition-group name="list" tag="div">
          <character-edit class="mt-2" :ref="`ent-${entity.id}`" :room="room" :entity="entity" v-for="entity in sortedMonsters" :key="entity.id" :hp-hidden="room.monsterHpHidden" :disable-controls="true" />
        </transition-group>
      </div>
    </div>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import CharacterEdit from '@/components/CharacterEdit.vue';
import UserTile from '@/components/UserTile.vue';
import Modal from '@/components/Modal.vue';
import clipboard from 'clipboard-polyfill';
import gql from 'graphql-tag';

export default {
  components: {
    CharacterEdit,
    UserTile,
    Modal,
  },

  methods: {
    async copyLink() {
      await clipboard.writeText(`${location.protocol}//${location.host}/room/${this.room.id}`);
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        type: 'success',
        title: 'Link copied to clipboard',
      });
    },

    isMaster(user) {
      const isMaster = this.room.masters.find(m => m.id === user.id) !== undefined;
      return isMaster;
    }
  },

  computed: {
    sortedMonsters() {
      if (this.room) {
        return this.room.entities.slice().filter(e => e.type === 'monster').sort((a, b) => a.sort - b.sort);
      }

      return [];
    },

    sortedCharacters() {
      if (this.room) {
        return this.room.entities.slice().filter(e => e.type === 'character').sort((a, b) => a.sort - b.sort);
      }

      return [];
    }
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
        document: gql(`
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
        `),

        variables() {
          return {
            id: this.$route.params.id,
          };
        },

        updateQuery: (previous, newData) => {
          console.log('SUB', previous, newData);
        },
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
