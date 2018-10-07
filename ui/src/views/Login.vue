<template>
  <div class="container mt-2">
    <login />
    <!-- <playground /> -->
  </div>
</template>
<script>
import Login from '@/components/Login.vue';
import Playground from '@/components/Playground.vue';

export default {
  components: {
    Login,
    Playground
  }
}
</script>

