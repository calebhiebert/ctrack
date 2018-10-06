<template>
  <div>
    <character-edit class="mb-2" ref="editor" :room="room" :entity="entity" v-for="entity of myEntities" :key="entity.id" :hide-assign-control="true" :expandable="false" :orderable="false" hide-delete :hideSaveAsTemplate="true" :hideSwitchType="true" />
  </div>
</template>
<script>
import CharacterEdit from '@/components/CharacterEdit.vue';
import gql from 'graphql-tag';

export default {
  components: {
    CharacterEdit,
  },

  props: {
    room: {
      type: Object,
      required: true,
    },
  },

  async created() {
    try {
    const ent = await this.$apollo.mutate({
      mutation: gql`
        mutation AddEntity($roomId: ID!, $input: AddEntityInput!) {
          addEntity(roomId: $roomId, input: $input) {
            id
            type
            name
            controllingIds
            hitpoints
            maxHitpoints
          }
        }
      `,

      variables: {
        roomId: this.$route.params.id,
        input: {
          type: 'character',
          name: 'Hof',
          maxHitpoints: 100,
        },
      },
    });

    console.log(ent);
    } catch(err) {
      console.log('Could not create Character');
    }
  },

  methods: {
    expand() {
      this.$refs.editor.expand();
    },

    collapse() {
      this.$refs.editor.collapse();
    },
  },

  computed: {
    myEntities() {
      const userId = this.$store.state.me.id;

      return this.room.entities.filter((entity) => entity.controllingIds.indexOf(userId) !== -1);
    },
  },
};
</script>

<style lang="scss" scoped>
.meter {
	transition: all 0.25s;
}
</style>


