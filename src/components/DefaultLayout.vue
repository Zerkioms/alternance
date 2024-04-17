<!-- HTML du composant DefaultLayout -->
<template>
  <!-- Barre de navigation -->
  <Navigation><search v-if="authStore.isLogged && route.name !== 'Accueil' && route.name !== 'Recherche'" /></Navigation>
  <!-- Fin de la barre de navigation -->
  <!-- Conteneur du body de l'application -->
  <main>
    <div class="main-container">
      <slot></slot>
    </div>
  </main>
  <!-- Fin du conteneur de l'application -->
  <!-- Footer de l'application -->
  <Footer />
  <!-- Fin du footer de l'application -->
</template>
<!-- Fin de l'HTML du composant DefaultLayout -->

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useAuthService, useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";
import { useRoute } from 'vue-router'

const apiClient = useApiClient();
const authService = useAuthService()
const authStore = useAuthStore()
const route = useRoute()

onBeforeMount(async () => {
  authStore.init(authService.authData)
 })
</script>