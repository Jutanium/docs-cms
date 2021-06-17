<template>
  <div id="app">
    <Renderer :content="doc.body" :components="registeredComponents">
      <template v-slot:DevSlot1>
        I'm a slot
        <p>
          A second element
        </p>
      </template>
    </Renderer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Renderer from './components/Renderer';
import doc from "../../sandbox/components.json"
import OneSlot from "./components/OneSlot"
import MyComponent from "./components/MyComponent"

export default Vue.extend({
  name: 'App',
  components: {
    Renderer
  },
  data: () => ({
    doc,
    registeredComponents: {
      OneSlot,
      MyComponent
    }
  })
});
</script>

<style>
</style>
