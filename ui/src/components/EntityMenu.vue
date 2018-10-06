<template>
  <div class="dropdown dropdown-right">
    <button class="btn btn-link btn-sm dropdown-toggle" tabindex="0">
      <i class="icon icon-more-vert"></i>
    </button>
    <ul class="menu">
      <li class="menu-item c-hand" @click="saveAsPreset" v-if="hideSaveAsPreset !== true">
        <a>
          <i class="icon icon-bookmark"></i>
          Save As Preset
        </a>
      </li>
      <li class="menu-item c-hand" @click="assignControl" v-if="hideAssignControl !== true">
        <a>
          <i class="icon icon-people"></i>
          Assign Control
        </a>
      </li>
      <li class="menu-item c-hand" @click="switchType('character')" v-if="hideSwitchType !== true && entity.type !== 'character'">
        <a>
          <i class="icon icon-refresh"></i>
          Make Character
        </a>
      </li>
      <li class="menu-item c-hand" @click="switchType('monster')" v-if="hideSwitchType !== true && entity.type !== 'monster'">
        <a>
          <i class="icon icon-refresh"></i>
          Make Monster
        </a>
      </li>
      <li class="menu-item c-hand" @click="switchType('pet')" v-if="hideSwitchType !== true && entity.type !== 'pet'">
        <a>
          <i class="icon icon-refresh"></i>
          Make Pet
        </a>
      </li>
      <li class="menu-item c-hand" @click="deleteEntity" v-if="hideDelete !== true">
        <a>
          <i class="icon icon-cross text-error"></i>
          <span class="text-error"> Kill</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    entity: {
      required: true,
      type: Object,
    },

    hideDelete: {
      required: false,
      type: Boolean,
      default: false
    },

    hideSaveAsPreset: {
      required: false,
      type: Boolean,
      default: false,
    },

    hideSwitchType: {
      required: false,
      type: Boolean,
      default: false
    },

    hideAssignControl: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  methods: {
    deleteEntity() {
      this.$emit('delete');
    },

    saveAsPreset() {
      this.$emit('save-as-preset')
    },

    switchType(type) {
      this.$emit('switch-type', type);
    },

    assignControl() {
      this.$emit('assign-control');
    }
  }
}
</script>

