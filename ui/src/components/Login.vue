<template>
  <div class="card p-2">
    <form @submit.prevent="submit">
      <div class="form-group" :class="{'has-error': errors.has('username')}">
        <label class="form-label text-bold label-lg">
          Username
        </label>
        <input class="form-input input-lg" v-validate="{required: true, min: 3, max: 255}" v-model="username" type="text" name="username" placeholder="Nurrak">
        <p class="form-input-hint" v-if="errors.has('username')">
          {{ errors.first('username') }}
        </p>
      </div>

      <button class="btn btn-primary float-right" type="submit" :class="{'loading': loading}">
        Login
      </button>
    </form>
  </div>
</template>
<script>
import gql from 'graphql-tag';

export default {

  data() {
    return {
      loading: false,
      username: ''
    }
  },

  methods: {
    async submit() {
      const valid = await this.$validator.validateAll();

      if (!valid) {
        return;
      }

      this.loading = true;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation Authenticate($username: String!) {
            authenticate(username: $username) {
              token
              user {
                id
                name
              }
            }
          }
        `,

        variables:{ 
          username: this.username
        }
      });

      const authResult = result.data.authenticate;
      localStorage.setItem('auth-token', authResult.token);
      this.loading = false;
      this.$store.commit('setUser', authResult.user);
      this.$store.commit('setToken', authResult.token);

      const redirect = localStorage.getItem('room-id-after-login');

      if (redirect) {
        localStorage.removeItem('room-id-after-login');
        this.$router.replace({name: 'room-id', params: {id: redirect}});
      } else {
        this.$router.replace({name: 'home'})
      }
    }
  }
}
</script>
