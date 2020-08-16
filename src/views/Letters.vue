<template>
  <div class="letters lines">
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
        <wired-button elevation="2" @click="get('vowel')" :disabled="!canGetVowel">
          <div class="label">VOWEL</div>
        </wired-button>
      </div>
      <div class="choice" v-if="!ready">
        <wired-button elevation="2" @click="get('consonant')" :disabled="!canGetConsonant">
          <div class="label">CONSONANT</div>
        </wired-button>
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
    <wired-dialog :open="result" v-if="result">
      <p v-if="result.won">YOU WON!</p>
      <p v-else>BOT WON</p>
      <div v-if="result.defn1" class="small">
        <div>
          <strong>YOU</strong>
        </div>
        <strong>{{ result.answer1 }}:</strong>
        {{ result.defn1 }}
      </div>
      <div v-if="result.defn2" class="small">
        <div>
          <strong>BOT</strong>
        </div>
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

@Component
export default class Letters extends Vue {
  interval = -1;
  left = 60;

  async mounted() {
    this.$store.dispatch("startLetters");

    this.interval = setInterval(() => {
      this.left--;
      if (this.left == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  async get(type: "consonant" | "vowel") {
    const isConsonant = type === "consonant";
    if (
      (isConsonant && this.canGetConsonant) ||
      (!isConsonant && this.canGetVowel)
    ) {
      this.$store.dispatch("getLetter", type);
    }
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

  get canGetVowel() {
    return Math.max(4 - this.consonants, 0) < 9 - this.letters.length;
  }

  get canGetConsonant() {
    return Math.max(3 - this.vowels, 0) < 9 - this.letters.length;
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

  get canSubmit() {
    return this.word.length > 0 && !this.result;
  }

  get result() {
    return this.$store.getters.lettersResult;
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

.letters {
  @include center;
  height: 100%;
  width: 100%;
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

.small {
  font-size: small;
}

.lines {
  background-image: repeating-linear-gradient(0deg, lightsteelblue, lightsteelblue 1px, transparent 1px, transparent);
  background-size: 35px 35px;
}
</style>
