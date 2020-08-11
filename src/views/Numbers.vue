<template>
  <div class="numbers">
    <div>NUMBERS</div>
    <div class="timer">
      <wired-progress :value="left" max="60" class="progress"></wired-progress>
    </div>
    <div />
    <div>
      <div v-if="!ready">
        <div class="choice medium">HOW MANY LARGE NUMBERS?</div>
        <div v-for="n in [1, 2, 3, 4]" :key="n" class="choice">
          <wired-button elevation="2" @click="getNumbers(n)">
            <div class="label">{{ n }}</div>
          </wired-button>
        </div>
      </div>
      <div>{{JSON.stringify(ops)}}</div>
      <div class="numbers-list">
        <wired-button
          v-for="i in numbers"
          :key="i.index"
          class="number-button"
          @click="addNumber(i)"
          :disabled="!ready || i.used || !nextIsOperand"
        >
          <div class="number-label">{{ i.number }}</div>
        </wired-button>
      </div>
      <div v-if="ready">
        <div class="numbers-list">
          <wired-button
            v-for="o in ['+', '-', '*', '/']"
            :key="o"
            class="number-button"
            @click="addOperation(o)"
            :disabled="!ready || nextIsOperand"
          >
            <div class="number-label">{{ o }}</div>
          </wired-button>
        </div>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="backspace()">
          <div class="label">BACKSPACE</div>
        </wired-button>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="submit()" :disabled="!canSubmit">
          <div class="label">SUBMIT</div>
        </wired-button>
      </div>
    </div>
    <wired-dialog :open="numbersResult" v-if="numbersResult">
      <p v-if="numbersResult.won">YOU WON!</p>
      <p v-else>BOT WON</p>
      <div v-if="numbersResult.defn1" class="small">
        <strong>{{ numbersResult.answer1 }}:</strong>
        {{ numbersResult.defn1 }}
      </div>
      <div v-if="numbersResult.defn2" class="small">
        <strong>{{ numbersResult.answer2 }}:</strong>
        {{ numbersResult.defn2 }}
      </div>
      <div style="text-align: right; padding: 30px 16px 16px;">
        <wired-button @click="$router.push('/')">PLAY AGAIN</wired-button>
      </div>
    </wired-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Numbers extends Vue {
  interval = -1;
  left = 60;

  async mounted() {
    this.$store.dispatch("startNumbers");

    this.interval = setInterval(() => {
      this.left--;
      if (this.left == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  async getNumbers(largeCount: number) {
    this.$store.dispatch("getNumbers", largeCount);
  }

  get numbers() {
    return this.$store.getters.numbers;
  }

  get ready() {
    return this.numbers.length;
  }

  get canSubmit() {
    return false;
  }

  get result() {
    return this.$store.getters.numbersResult;
  }

  get ops() {
    return this.$store.getters.ops;
  }

  /**
   * ops field holds the math operations by the user, for instance
   * 3 + 5 = 8  8 * 7 = 56  is stored as
   * [ 3, '+', 5, 8, '*', 7 ]
   * This getter tells if the next input should be an operand
   * as opposed to an operator following this convention
   */
  get nextIsOperand() {
    if (this.ops.length === 0) {
      return true;
    } else if (this.ops.length === 1) {
      return false;
    } else if (typeof this.ops[this.ops.length - 1] === "string") {
      return true;
    } else if (typeof this.ops[this.ops.length - 2] === "string") {
      return true;
    } else {
      return false;
    }
  }

  addNumber(numberInfo: any) {
    if (this.nextIsOperand && !numberInfo.used) {
      this.$store.dispatch("addNumber", numberInfo);
    }
  }

  addOperation(op: string) {
    if (!this.nextIsOperand) {
      this.$store.dispatch("addOperation", op);
    }
  }

  backspace() {
    this.$store.dispatch("backspace");
  }

  submit() {
    if (this.canSubmit) {
      this.$store.dispatch("submit");
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin center {
  display: grid;
  place-items: center;
}

.numbers {
  @include center;
  height: 90vh;
}

.label {
  padding: 0 3rem;
  min-width: 6rem;
}

.choice {
  @include center;
  margin: 1rem 0;
}

.timer {
  @include center;
}

.progress {
  max-width: 90vw;
}

.number-label {
  padding: 0 0.5rem;
}

.number-button {
  margin: 0 0.5rem;
}

.numbers-list {
  max-width: 15rem;
}

.small {
  font-size: x-small;
}

.medium {
  font-size: small;
}
</style>
