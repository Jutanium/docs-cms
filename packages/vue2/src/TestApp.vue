<template>
  <div id="app">
    <Renderer></Renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Renderer from './components/Renderer';

export default Vue.extend({
  name: 'App',
  components: {
    Renderer
  }
});
</script>

<style>
</style>
