<template>
  <div>
    <input type="file" class="form-input" accept="image/*" @change="fileChange">
    <img class="img-responsive mt-2" v-if="preview !== null" :src="preview">
    <button class="btn btn-primary float-right mt-2" v-if="preview !== null" @click="submit">Use Image</button>
  </div>
</template>
<script>
import Pica from 'pica';

export default {
  
  data() {
    return {
      preview: null,
    }
  },

  methods: {
    async fileChange(e) {
      const file = e.target.files[0];
      this.preview = null;
      const pica = new Pica();

      const canvas = document.createElement('canvas');
      canvas.height = 64;
      canvas.width = 64;

      const result = await this.readFile(file);

      await pica.resize(result, canvas, {
        quality: 3,
        alpha: false,
        unsharpAmount: 0,
        unsharpRadius: 0,
        unsharpThreshold: 0,
        transferable: true
      });
      // this.preview = result;
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();

        fr.addEventListener('load', () => {
          resolve(fr.result);
        });

        fr.readAsDataURL(file);
      });
    },

    submit() {
      if (this.preview !== null) {
        this.$emit('done', {
          dataUri: this.preview
        })
      }
    }
  }
}
</script>

