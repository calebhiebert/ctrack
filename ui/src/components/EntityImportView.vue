<template>
  <div v-if="!$apollo.loading">
    <div class="columns">
      <div class="column col-6">
        <div class="form-group">
          <textarea v-model="json" class="form-input m-0" style="width: 100%; min-width: 100%; max-height: 5rem; min-height: 5rem;" placeholder="Paste data" rows="5"></textarea>
          <p class="form-input-hint mb-0" v-if="!jsonValid">
            This is not a valid save file!
          </p>
        </div>
      </div>
      <div class="divider-vert" data-content="OR"></div>
      <div class="column">
        <input class="form-input" type="file" name="file" @change="onFileChange">
        <p class="form-input-hint mb-0" v-if="!fileValid">
          This is not a valid save file!
        </p>
      </div>
    </div>
    <button class="btn btn-primary float-right" v-if="canImport" @click="doImport">
      Import
    </button>
  </div>
  <div class="loading" v-else></div>
</template>
<script>
import gql from 'graphql-tag';
import saveFile from 'file-saver';

export default {
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      json: '',
      jsonValid: true,
      fileValid: true,
    }
  },

  watch: {
    json(newValue) {
      console.log('Evaluating JSON');
      this.jsonValid = true;

      if (newValue === '') {
        return;
      }

      try {
        JSON.parse(newValue);
      } catch(err) {
        this.jsonValid = false;
      }
    }
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
    async onFileChange(e) {
      const file = e.target.files[0];

      if (file) {
        if (file.type.indexOf('json') === -1) {
          this.fileValid = false;
          return;
        }

        const jsonText = await this.readFile(file);
        this.json = jsonText;
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();

        fr.addEventListener('load', () => {
          resolve(fr.result);
        });

        fr.readAsText(file);
      })
    },

    async doImport() {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation DoImport($roomId: ID!, $json: String!) {
            importCharacterData(roomId: $roomId, exportJson: $json) {
              id
            }
          }
        `,

        variables: {
          roomId: this.roomId,
          json: this.json
        }
      });

      this.$emit('done');
    }
  },

  computed: {
    canImport() {
      if (this.json !== '' && this.jsonValid === true && this.fileValid === true) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style>
.expanded {
	width: 100%;
}
</style>
