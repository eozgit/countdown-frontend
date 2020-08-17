<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "Gloria Hallelujah";
  src: url("assets/GloriaHallelujah-Regular.ttf") format("truetype");
}

#app {
  font-family: "Gloria Hallelujah", cursive;
  font-size: xx-large;
  display: grid;
  place-items: center;
  height: 92%;
}
</style>
