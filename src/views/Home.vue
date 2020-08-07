<template>
  <div class="home">
    <div>COUNTDOWN</div>
    <div />
    <div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('letters')">
          <span class="label">LETTERS</span>
        </wired-button>
      </div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('numbers')">
          <span class="label">NUMBERS</span>
        </wired-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import "wired-elements";

@Component
export default class Counter extends Vue {}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  place-items: center;
  height: 90vh;
}

.label {
  padding: 1rem 3rem;
}

.choice {
  margin: 0.5rem 0;
}
</style>
