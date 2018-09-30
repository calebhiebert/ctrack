<template>
  <div class="container">
    <room-landing :room="room" v-if="!$apollo.loading" />
    <div class="loading" v-else></div>
  </div>
</template>
<script>
import RoomLanding from '@/components/RoomLanding.vue';
import gql from 'graphql-tag';

export default {
  components: {
    RoomLanding
  },

  apollo: {
    room: {
      query: gql`
        query GetRoom($id: ID!) {
          room(id: $id) {
            id
            name
            usePassword
            masters {
              id
              name
            }
            users {
              id
              name
            }
          }
        }
      `,
      
      variables() {
        return {
          id: this.$route.params.id
        }
      },
    },


  }
}
</script>

