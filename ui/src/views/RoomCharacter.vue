<template>
  <div class="container grid-lg" v-if="!$apollo.loading">
    <character-control :room="room" />

    <div class="divider text-center" data-content="Monsters" v-if="sortedMonsters.length > 0"></div>
    <transition-group name="list" tag="div">
      <character-edit class="mt-2" :ref="`ent-${entity.id}`" :room="room" :entity="entity" v-for="entity in sortedMonsters" :key="entity.id" :hp-hidden="room.monsterHpHidden" :disable-controls="true" />
    </transition-group>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import CharacterControl from '@/components/CharacterControl.vue';
import CharacterEdit from '@/components/CharacterEdit.vue';

export default {
  components: {
    CharacterControl,
    CharacterEdit
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

  computed: {
    sortedMonsters() {
      if (this.room) {
        return this.room.entities.slice().filter(e => e.type === 'monster').sort((a, b) => a.sort - b.sort);
      }

      return [];
    },
  }
};
</script>
