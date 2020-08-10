<template>
  <div class="letters">
    <div>LETTERS</div>
    <div class="timer">
      <wired-progress :value="left" max="60" class="progress"></wired-progress>
    </div>
    <div />
    <div class="choice">{{ word }}</div>
    <div>
      <div class="letters-list">
        <wired-button
          v-for="i in letters"
          :key="i.index"
          class="letter-button"
          @click="type(i)"
          :disabled="!ready || i.used"
        >
          <div class="letter-label">{{ i.letter }}</div>
        </wired-button>
      </div>
      <div class="choice" v-if="!ready">
        <wired-button elevation="2" @click="get('vowel')">
          <div class="label">VOWEL</div>
        </wired-button>
      </div>
      <div class="choice" v-if="!ready">
        <wired-button elevation="2" @click="get('consonant')">
          <div class="label">CONSONANT</div>
        </wired-button>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="backspace()">
          <div class="label">BACKSPACE</div>
        </wired-button>
      </div>
      <div class="choice" v-if="ready">
        <wired-button elevation="2" @click="submit()">
          <div class="label">SUBMIT</div>
        </wired-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { start, letters } from "../client";

@Component
export default class Letters extends Vue {
  interval = -1;
  left = 60;

  async mounted() {
    this.$store.dispatch("clearLetters");

    await start("letters");

    this.interval = setInterval(() => {
      this.left--;
      if (this.left == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  async get(type: string) {
    const response = await letters(type);

    const { letter } = await response.json();

    this.$store.dispatch("addLetter", { letter, type });
  }

  get letters() {
    return this.$store.getters.letters;
  }

  get vowels() {
    return this.$store.getters.vowels;
  }

  get consonants() {
    return this.$store.getters.consonants;
  }

  get total() {
    return this.$store.getters.total;
  }

  get ready() {
    return this.$store.getters.ready;
  }

  get word() {
    return this.$store.getters.word;
  }

  type(info: any) {
    if (!info.used) {
      this.$store.dispatch("type", info);
    }
  }

  backspace() {
    this.$store.dispatch("backspace");
  }

  submit() {
    this.$store.dispatch("submit");
  }
}
</script>

<style lang="scss" scoped>
@mixin center {
  display: grid;
  place-items: center;
}

.letters {
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

.letter-label {
  padding: 0 0.5rem;
}

.letter-button {
  margin: 0 0.5rem;
}

.letters-list {
  max-width: 13rem;
}
</style>
