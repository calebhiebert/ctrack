<template>
  <div class="card p-2">
    <form @submit.prevent="submit">
      <div class="form-group" :class="{'has-error': errors.has('name')}">
        <label class=" form-label text-bold label-lg">
          Room Name
        </label>
        <input v-validate="{required: true, min: 2, max: 255}" v-model="roomName" name="name" class="form-input input-lg" type="text" placeholder="Room Name">
        <p class="form-input-hint" v-if="errors.has('name')">
          {{ errors.first('name') }}
        </p>
      </div>
      <div class="form-group mb-0">
        <label class="form-switch">
          <input v-model="usePassword" type="checkbox">
          <i class="form-icon"></i> Use a password
        </label>
      </div>

      <!-- Password Input -->
      <div class="form-group" v-if="usePassword">
        <label class="form-label text-bold label-lg">
          Room Password
        </label>
        <input class="form-input input-lg" v-model="password" name="password" type="password" placeholder="****" v-validate="{required: true, min: 4, max: 255}">
        </div>

        <!-- Button -->
        <button class="btn btn-primary float-right">
          Create Room
        </button>
    </form>
  </div>
</template>
<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      roomName: '',
      usePassword: false,
      password: ''
    }
  },

  methods: {
    async submit() {
      const valid = await this.$validator.validateAll();

      if (valid) {
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation CreateRoom($input: CreateRoomOptions!) {
              createRoom(input: $input) {
                id
                name
              }
            }
          `,

          variables: {
            input: {
              name: this.roomName,
              usePassword: this.usePassword,
              password: this.password
            }
          }
        });

        this.$router.replace({
          name: 'room-id',
          params: {
            id: result.data.createRoom.id,
          }
        })
      }
    }
  }
}
</script>
