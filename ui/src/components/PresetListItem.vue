<template>
  <div class="bordered p-2 tile tile-centered">
    <div class="tile-icon">
      <avatar class="avatar-sm" :id="preset.id" :datauri="preset.imageData" />
    </div>
    <div class="tile-content">
      <span class="text-bold">{{ preset.name }}</span> (<span>{{ preset.maxHitpoints }}hp</span>)
    </div>

    <!-- Controls -->
    <div v-if="!spawnMode && !deleteMode">
      <button class="btn btn-link btn-small float-right" @click="spawn">
        Spawn
        <i class="icon icon-arrow-right"></i>
      </button>
      <button class="btn btn-link btn-small float-right" @click="remove">
        <span class="text-error">Delete </span>
        <i class="icon icon-cross text-error"></i>
      </button>
    </div>

    <!-- Spawn Mode -->
    <div class="d-flex" v-if="spawnMode" style="min-width: 8rem;">
      <input class="slider tooltip" type="range" min="1" max="25" v-model="spawnCount" :data-tooltip="spawnCount">
      <button class="btn btn-sm btn-primary float-right ml-2" @click="doSpawn">Go</button>
    </div>

    <!-- Delete Mode -->
    <div class="d-flex" v-if="deleteMode">
      <span class="text-bold">Are you sure?</span>
      <button class="btn btn-sm btn-primary ml-2" @click="deleteMode = false">
        Cancel
      </button>
      <button class="btn btn-sm ml-2" @click="doDelete">
        Yes
      </button>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/UserAvatar.vue';

export default {
  components: {
    Avatar,
  },

  props: {
    preset: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      spawnMode: false,
      deleteMode: false,

      spawnCount: 1
    }
  },

  methods: {
    spawn() {
      this.spawnMode = true;
    },

    remove() {
      this.deleteMode = true;
    },

    doSpawn() {
      this.$emit('spawn', { count: this.spawnCount, id: this.preset.id });
    },

    doDelete() {
      this.$emit('delete', {id: this.preset.id});
    }
  }
}
</script>

<style lang="scss" scoped>
.d-flex {
	justify-content: center;
}
</style>
