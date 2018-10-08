<template>
  <div id='app'>
    <nav-bar class='mt-2' />
    <router-view />
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import gql from 'graphql-tag';

export default {
  components: {
    NavBar,
  },

  async created() {
    console.log(process.env.NODE_ENV, process.env);

    const authDetails = await this.$apollo.query({
      query: gql`
        query AuthCheck {
          me {
            id
            name
          }
        }
      `,
    });

    const authResult = authDetails.data.me;

    if (authResult !== null) {
      this.$store.commit('setUser', authResult);
    } else {
      this.$router.push({
        name: 'login',
      });
    }

    console.log(authDetails.data);
  },
};
</script>
