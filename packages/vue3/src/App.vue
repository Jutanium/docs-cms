<script setup lang="ts">
import OneSlot from "./components/OneSlot.vue";
import doc from "../../sandbox/components.json";
</script>

<template>
  <div>
    <div>hi there testing</div>
    <OneSlot> slot here </OneSlot>
    {{ doc }}
  </div>
</template>

<style>
</style>
