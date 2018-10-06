<template>
  <form class="mt-1" @submit.prevent="submit">
    <div class="form-group">
      <input ref="input" v-model="rawText" class="form-input" placeholder="+20" type="tel">
      <p class="form-input-hint">
        {{ hpStatus.status }}
      </p>
    </div>
    <button class="btn" type="button" @click="fill">
      Fill
      <i class="icon icon-plus"></i>
    </button>
    <button class="btn ml-2" type="button" @click="kill">
      Kill
      <i class="icon icon-cross"></i>
    </button>
    <button class="btn btn-primary float-right" type="submit">OK</button>
  </form>
</template>
<script>
export default {
  props: {
    currentHitpoints: {
      type: Number,
      required: true,
    },

    maxHitpoints: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      valid: true,
      operator: '',
      amount: 0,
      rawText: '',
    };
  },

  watch: {
    rawText(newValue, oldValue) {
      const rx = /^([-]|[+]|[/]|[*])?([0-9.]+)$/;

      const matchResult = newValue.match(rx);

      if (matchResult) {
        const [whole, operator, amount] = newValue.match(rx);
        this.operator = operator;
        this.amount = parseFloat(amount);
        this.valid = true;
      } else {
        this.valid = false;
        this.operator = '';
        this.amount = 0;
      }
    },
  },

  computed: {
    hpStatus() {
      if (!this.valid && this.rawText !== '') {
        return 'Invalid operation';
      } else if (this.rawText === '') {
        return 'Nothing will happen';
      } else {
        let status = '';
        let newHealth = this.currentHitpoints;

        switch (this.operator) {
          case '*':
            status = `Health will be multiplied by ${this.amount}.`;
            newHealth *= this.amount;
            break;
          case '+':
            status = `${this.amount} will be added to health.`;
            newHealth += this.amount;
            break;
          case '-':
            status = `${this.amount} will be subtracted from health.`;
            newHealth -= this.amount;
            break;
          case '/':
            status = `Health will be divided by ${this.amount}.`;
            newHealth /= this.amount;
            break;
          default:
            status = `Health will be set to ${this.amount}.`;
            newHealth = this.amount;
            break;
        }

        if (newHealth > this.maxHitpoints) {
          newHealth = this.maxHitpoints;
        } else if (newHealth < 0) {
          newHealth = 0;
        }

        newHealth = Math.round(newHealth);

        status += ` New health is ${newHealth}`;

        return { status, newHealth };
      }
    },
  },

  mounted() {
    this.$refs.input.focus();
  },

  methods: {
    submit() {
      const event = {
        hitpoints: this.currentHitpoints,
        maxHitpoints: this.maxHitpoints,
        operator: this.operator,
        amount: this.amount,
        newHitpoints: this.hpStatus.newHealth,
      };

      this.$emit('done', event);
    },

    fill() {
      const event = {
        hitpoints: this.currentHitpoints,
        maxHitpoints: this.maxHitpoints,
        operator: this.operator,
        amount: this.amount,
        newHitpoints: this.maxHitpoints,
      };

      this.$emit('done', event);
    },
    
    kill() {
      this.$emit('kill');
    }
  },
};
</script>

