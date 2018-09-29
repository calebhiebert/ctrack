<template>
  <div class="card p-2">
    <form @submit.prevent="submit">
      <div class="form-group">
        <label class="form-label label-lg text-bold">Room Tag</label>
        <input class="form-input input-lg" maxlength="4" name="tag" placeholder="XXXX" v-model="tag">
      </div>

        <div class="loading" v-if="loadingRoom"></div>

        <div class="toast toast-error mb-2" v-if="roomNotFound">
          Sorry, but I couldn't find a room with that tag!
        </div>

        <div v-if="roomData">
          <h3>
            {{ roomData.name }}
          </h3>
        </div>

        <div class="form-group" v-if="roomData && roomData.usePassword === true">
          <label class="form-label label-lg text-bold">Password</label>
          <input class="form-input input-lg" type="password" name="password" placeholder="****" v-model="password">
      </div>

          <button class="btn btn-primary float-right" :disabled="!canJoin">
            Join
          </button>
    </form>
  </div>
</template>
<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      loadingRoom: false,
      roomData: null,
      roomNotFound: false,

      tag: '',
      password: '',
    };
  },

  watch: {
    tag() {
      if (this.tag) {
        this.roomNotFound = false;
        const tagString = this.tag.toString();
        const upperd = tagString.toUpperCase();

        this.tag = upperd;

        if (this.tag.length === 4 && !this.loadingRoom) {
          this.loadRoomDetails(this.tag);
        }
      }
    },
  },

  computed: {
    canJoin() {
      return this.roomData !== null && (this.roomData.usePassword ? this.password.trim().length > 1 : true);
    },
  },

  methods: {
    async loadRoomDetails(id) {
      this.loadingRoom = true;

      const {
        data: { room },
      } = await this.$apollo.query({
        query: gql`
          query GetRoom($id: ID!) {
            room(id: $id) {
              id
              name
              usePassword
            }
          }
        `,

        variables: {
          id,
        },
      });

      if (room) {
        this.roomData = room;
      } else {
        this.roomNotFound = true;
      }

      this.loadingRoom = false;
    },

    async submit() {
      const valid = await this.$validator.validateAll();

      if (!valid) {
        return;
      }

      try {
        const joinResult = this.$apollo.mutate({
          mutation: gql`
            mutation JoinRoom($input: JoinRoomOptions!) {
              joinRoom(input: $input) {
                id
                name
              }
            }
          `,

          variables: {
            input: {
              id: this.tag,
              password: this.password
            }
          }
        })
      } catch(err) {
        console.log(err, err.errors);
      }
    }
  },
};
</script>

