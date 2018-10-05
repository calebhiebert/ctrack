<template>
  <div>
    <input type="file" class="form-input" accept="image/*" @change="fileChange">
    <img class="img-responsive mt-2" v-if="preview !== null" :src="preview">
    <button class="btn btn-primary float-right mt-2" v-if="preview !== null" @click="submit">Use Image</button>
  </div>
</template>
<script>
import readAndCompressImage from 'browser-image-resizer';

const imageConfig = {
  quality: 0.5,
  maxWidth: 128,
  maxHeight: 128,
  autoRotate: true,
  debug: true,
};

export default {
  data() {
    return {
      preview: null,
    };
  },

  methods: {
    async fileChange(e) {
      const file = e.target.files[0];
      this.preview = null;
      const resizedImage = await readAndCompressImage(file, imageConfig);
      const dataUri = await this.readBlobToDataUri(resizedImage);
      this.preview = dataUri;
    },

    readBlobToDataUri(blob) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();

        fr.addEventListener('load', () => {
          resolve(fr.result);
        });

        fr.readAsDataURL(blob);
      });
    },

    submit() {
      if (this.preview !== null) {
        this.$emit('done', {
          dataUri: this.preview,
        });
      }
    },
  },
};
</script>

