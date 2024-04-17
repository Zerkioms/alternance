<script setup>
import Dialog from 'primevue/dialog';

import { ref } from "vue";

const visible = ref(false);

</script>


<template>
  <footer class="flex surface-100 mt-6 align-items-center justify-content-center">
<p class="text-sm text-500 text-center cursor-pointer" @click="visible = true">Version 1.2.1</p>
  </footer>
  <Dialog v-model:visible="visible" header="LINX" :style="{ width: '50vw' }">
    <h4>Informations</h4>
    <p>
      LINX est une application permettant la gestion des équipements audiovisuels installés dans les salles ou amphis de l'établissement
    </p>
    <p>
      Cette application a été développée à la DSI de La Rochelle Universitaire dans le cadre d'un contrat d'apprentissage
    </p>
    <h4>Développeurs</h4>
    <ul>
<li>Bilal Belmokhtar</li>
<li>Franck Charneau</li>

    </ul>
</Dialog>
</template >


  <script>
    export default {
      name: "Footer",

};
</script>
<style scoped></style>