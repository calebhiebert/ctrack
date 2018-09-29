<template>
  <header class='navbar'>
    <section class='navbar-section'>
      <router-link :to="{name: 'room-create'}" class='btn btn-link'>Create Room</router-link>
      <router-link :to="{name: 'room-join'}" class='btn btn-link'>Join Room</router-link>
    </section>
    <section class='navbar-center'>
      <!-- centered logo or brand -->
    </section>
    <section class='navbar-section'>
      <button class="btn btn-link" v-if="$store.state.me">{{ $store.state.me.name }}</button>
    </section>
  </header>
</template>
<script>
export default {};
</script>
