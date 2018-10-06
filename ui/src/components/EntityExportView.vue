<template>
  <div v-if="!$apollo.loading" class="columns">
    <div class="column">
      <button class="btn expanded" @click="copyToClipboard">
        Copy to Clipboard
      </button>
    </div>
    <div class="divider-vert" data-content="OR"></div>
    <div class="column">
      <button class="btn expanded" @click="saveAs">
        Save to File
      </button>
    </div>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import saveFile from 'file-saver';
import clipboard from 'clipboard-polyfill';

export default {
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },

  apollo: {
    room: {
      query: gql`
        query GetRoomExport($id: ID!) {
          room(id: $id) {
            id
            jsonExport
          }
        }
      `,

      variables() {
        return {
          id: this.roomId,
        };
      },

      fetchPolicy: 'network-only',
    },
  },

  methods: {
    saveAs() {
      saveFile(new Blob([this.room.jsonExport], { type: 'application/json' }), 'character-export.json');
    },

    async copyToClipboard() {
      await clipboard.writeText(this.room.jsonExport);
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        type: 'success',
        title: 'Character Data Copied',
      });

      console.log('Wrote text');
    },
  },
};
</script>

<style>
.expanded {
	width: 100%;
}
</style>
