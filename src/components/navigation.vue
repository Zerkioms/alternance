<script setup>
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref, watch } from 'vue'
//import { useAuthStore } from "../authentification/authentification.js";
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'


import ZoneController from "../Controllers/ZoneController.js";
import {useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";

const authStore = useAuthStore()
const route = useRoute()
const message = ref()
//const authStore = useAuthStore();

const loading2 = ref(true);
const touterecherche  = ref([])
const touterecherche2 = ref(null);
const zones = ref(null);





const items_connected = ref([
  {
    label: 'Zones',
    icon: 'fa-solid fa-location-dot',
    to: "/Zones"
  },
  {
    label: "Modèles",
    icon: 'fa-solid fa-book',
    to: "/Modeles_Equipement",
    visible: () => authStore.isAdmin


  },
  {
    label: "Paramètres",
    icon: 'fa-solid fa-screwdriver-wrench',
    visible: () => authStore.isAdmin,
    items: [
    {
    label: 'Caracteristiques',
    icon: 'fa-solid fa-gear',
    to: "/Caracteristiques",
    visible: () => authStore.isAdmin
  },
  {
    label: "Types d'équipement",
    icon: 'fa-solid fa-table-list',
    to: "/Type_Equipement",
    visible: () => authStore.isAdmin
  },
  {
    label: "Logs",
    icon: 'fa-solid fa-fingerprint',
    to: "/Logs",
    visible: () => authStore.isAdmin
  },
  {
    label: "Administration",
    icon: 'fa-solid fa-user-shield',
    to: "/Administration",
    visible: () => authStore.isAdmin
  },
  {
    label: "Types d'usage",
    icon: 'fa-solid fa-toolbox',
    to: "/Type_Usage",
    visible: () => authStore.isAdmin
  },
  ]
},
])


const items_profile = ref([

  {
    separator: true
  },
  {
    label: 'Deconnexion',
    icon: 'fa-solid fa-link-slash',
    command: () => {
      authStore.logout(),
      window.location.href = '/logout'
    }
  }
])

const home = ref({
  icon: 'pi pi-home',
  to: '/',
});

function rechercher(type) {
  if (type != null) {
  window.location.href = '/Recherche?q=' + type;
}else{
  window.location.href = '/Recherche'; 
}
}


</script>



<template>
  <Menubar :model="items_connected" class="menubar">
    <template #start>
      <router-link to="/">
        <img alt="image" src="../assets/linx.png" height="40" class="mr-2">
      </router-link>
    </template>
    <template #end>
     <slot></slot>
      <SplitButton :label="authStore.user.profile.given_name + ' ' + authStore.user.profile.family_name" :model="items_profile"
        class="p-button-text p-button-secondary" v-if="authStore.user">
      </SplitButton>
    </template>
  </Menubar>
</template>



<style>
.menubar {
  text-align: center;
}
</style>