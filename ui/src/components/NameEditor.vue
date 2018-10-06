<template>
  <form class="mt-2" @submit.prevent="submit">
    <div class="form-group">
      <input ref="input" v-model="name" class="form-input" v-validate="{required: true, min: 3, max: 255}" type="text" name="name">
      <p class="form-input-hint">
        {{ errors.first('name') }}
      </p>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    currentName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      name: '',
    };
  },

  created() {
    this.name = this.currentName;
  },

  mounted() {
    this.$refs.input.focus();
    this.$refs.input.setSelectionRange(0, this.name.length);
  },

  methods: {
    async submit() {
      const valid = await this.$validator.validateAll();

      if (!valid) {
        return;
      }

      this.$emit('done', {
        name: this.name,
      });
    },
  },
};
</script>

