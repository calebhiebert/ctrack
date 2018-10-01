<template>
  <div class="container grid-lg" v-if="!$apollo.loading">
    <character-edit class="mt-2" :entity="entity" v-for="entity in room.entities" :key="entity.id" />
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import CharacterEdit from '@/components/CharacterEdit.vue';

export default {
  components: {
    CharacterEdit,
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
