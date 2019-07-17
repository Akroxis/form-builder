<template>
  <div id="app">
    <FormView></FormView>
  </div>
</template>

<script>
import FormView from "./views/FormView";
export default {
  name: "app",
  components: { FormView }
};
</script>

<style lang="scss">
@import "./assets/common-styles.scss";
html {
  font-family: "Roboto-Regular", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f8f8;
}
@font-face {
  font-family: Roboto-Regular;
  src: url("./fonts/Roboto-Regular.ttf");
}
@font-face {
  font-family: Roboto-Medium;
  src: url("./fonts/Roboto-Medium.ttf");
}
@font-face {
  font-family: Roboto-Bold;
  src: url("./fonts/Roboto-Bold.ttf");
}
</style>
