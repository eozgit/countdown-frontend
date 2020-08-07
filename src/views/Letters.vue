<template>
  <div class="letters">
    <div>LETTERS</div>
    <div />
    <div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('letters')">
          <div class="label">VOWEL</div>
        </wired-button>
      </div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('numbers')">
          <div class="label">CONSONANT</div>
        </wired-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { start } from "../client";

@Component
export default class Letters extends Vue {
  async mounted() {
    const response = await start("letters");

    const json = await response.json();

    console.log(JSON.stringify(json));
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
</style>
