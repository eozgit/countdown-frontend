<template>
  <div class="home">
    <div>COUNTDOWN</div>
    <div />
    <div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('letters')">
          <div class="label">LETTERS</div>
        </wired-button>
      </div>
      <div class="choice">
        <wired-button elevation="2" @click="$router.push('numbers')">
          <div class="label">NUMBERS</div>
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
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
@mixin center {
  display: grid;
  place-items: center;
}

.home {
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
