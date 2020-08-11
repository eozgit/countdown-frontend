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
      <div v-if="ready" class="center medium">Target: {{ target }}</div>
      <div v-if="ready" class="center medium">
        Away: {{ away === null ? "-" : away }}
      </div>
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
      <div v-if="ready" class="numbers-list">
        <wired-button
          class="number-button"
          @click="addOperation(-1)"
          :disabled="!ready || nextIsOperand"
        >
          <div class="number-label">+</div>
        </wired-button>
        <wired-button
          class="number-button"
          @click="addOperation(-2)"
          :disabled="!ready || nextIsOperand"
        >
          <div class="number-label">-</div>
        </wired-button>
        <wired-button
          class="number-button"
          @click="addOperation(-3)"
          :disabled="!ready || nextIsOperand"
        >
          <div class="number-label">*</div>
        </wired-button>
        <wired-button
          class="number-button"
          @click="addOperation(-4)"
          :disabled="!ready || nextIsOperand"
        >
          <div class="number-label">/</div>
        </wired-button>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="backspace" :disabled="!ops.length">
          <div class="label">UNDO</div>
        </wired-button>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="submit" :disabled="!canSubmit">
          <div class="label">SUBMIT</div>
        </wired-button>
      </div>
    </div>
    <wired-dialog :open="result" v-if="result">
      <p v-if="result.won">YOU WON!</p>
      <p v-else>BOT WON</p>
      <div v-if="result.defn1" class="small">
        <strong>{{ result.answer1 }}:</strong>
        {{ result.defn1 }}
      </div>
      <div v-if="result.defn2" class="small">
        <strong>{{ result.answer2 }}:</strong>
        {{ result.defn2 }}
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
import { NumberInfo } from "../store";
import calculateNumbers from "../common/calculateNumbers";

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
    return this.away !== null && this.away < 10;
  }

  get result() {
    return this.$store.getters.numbersResult;
  }

  get ops() {
    return this.$store.getters.ops;
  }

  get target() {
    return this.$store.getters.target;
  }

  get away() {
    return this.$store.getters.away;
  }

  get nextIsOperand() {
    if (this.ops.length === 0) {
      return true;
    } else if (this.ops.length === 1) {
      return false;
    } else if (this.ops[this.ops.length - 1] < 0) {
      return true;
    } else if (this.ops[this.ops.length - 2] < 0) {
      return true;
    } else {
      return false;
    }
  }

  get originalNumbers() {
    return this.$store.getters.originalNumbers;
  }

  addNumber(numberInfo: any) {
    if (this.nextIsOperand && !numberInfo.used) {
      this.$store.dispatch("append", numberInfo.index);

      this.setNumbers();
    }
  }

  addOperation(op: number) {
    if (!this.nextIsOperand) {
      this.$store.dispatch("append", op);
      this.setNumbers();
    }
  }

  setNumbers() {
    const numbers: NumberInfo[] = calculateNumbers(
      this.originalNumbers,
      this.ops
    );

    this.$store.dispatch("setNumbers", numbers);
  }

  backspace() {
    if (this.ops.length) {
      this.$store.dispatch("backspace");
    }
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

.center {
  @include center;
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
