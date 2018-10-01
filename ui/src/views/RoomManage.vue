<template>
  <div class="container" v-if="!$apollo.loading">
    <div class="columns">
      <div class="column col-3">
        <ul class="menu">
          <li class="divider" data-content="Toolbox" />
          <li class="menu-item">
            <a>
              <i class="icon icon-plus"></i>
              Add Character
            </a>
          </li>
          <li class="menu-item">
            <a>
              <i class="icon icon-plus"></i>
              Add Monster
            </a>
          </li>
          <li class="menu-item">
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
          <li class="divider" data-content="Users" />
          <li class="menu-item" v-for="user of room.users" :key="user.id">
            <user-tile :user="user" />
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
        <character-edit class="mt-2" :entity="entity" v-for="entity in room.entities" :key="entity.id" />
      </div>
    </div>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import CharacterEdit from '@/components/CharacterEdit.vue';
import UserTile from '@/components/UserTile.vue';

export default {
  components: {
    CharacterEdit,
    UserTile,
  },

  apollo: {
    room: {
      query: gql`
        query GetRoom($id: ID!) {
          room(id: $id) {
            id
            name
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
