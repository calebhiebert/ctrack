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
    NavBar
  },

  apollo: {
    $subscribe: {
      ticker: {
        query: gql`
          subscription {
            ticker
          }
        `,

        variables() {
          return {};
        },

        result({data}) {
          console.log(data);
        }
      }
    }
  }
}
</script>
