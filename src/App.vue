<!-- Script du composant App -->
<script setup>
import { markRaw } from "vue";
import DefaultLayout from "@/components/DefaultLayout.vue";
// On n'a qu'un seul layout
// Si on veut en avoir plusieurs, il faut créer une méthode qui retourne le bon component
const layout = markRaw(DefaultLayout);
</script>
<!-- Fin du script du composant App -->
<!-- HTML du composant App -->
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<!-- Fin de l'HTML du composant App -->
<style>
.card-container {
  padding: 20px;
}
html {
  font-size: 14px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.p-submenu-list {
  width: 14rem !important;
}
</style>

