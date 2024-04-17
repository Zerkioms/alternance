<script setup>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import BreadCrumbVue from "../components/BreadCrumbVue.vue";
import { ref } from 'vue'


//import { useAuthStore } from '../authentification/authentification';
import ZoneController from '../Controllers/ZoneController';
import BatimentController from '../Controllers/BatimentController';
import SalleController from '../Controllers/SalleController';
import AssociationController from '../Controllers/AssociationController';
import { onMounted } from 'vue';
import InputText from 'primevue/inputtext';

import { useAuthService, useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authService = useAuthService()
const authStore = useAuthStore()

const message = ref()
const zones = ref();
const batiments = ref();
const salles = ref();
const equipements = ref();

onMounted(async () => {
  zones.value = await ZoneController.fetchAllZones(apiClient);
  batiments.value = await BatimentController.fetchAllBatiments(apiClient);
  salles.value = await SalleController.fetchAllSalles(apiClient);
  equipements.value = await AssociationController.fetchAllAssociations(apiClient);
});


const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})

const myItems = ref([])

function rechercher(type, groupe) {
  if (type != null) {
    if(groupe != null) {
      window.location.href = '/Recherche?q=' + type + '&r=' + groupe;
      }else{
      window.location.href = '/Recherche?q=' + type
      }
}else{
  if (groupe != null) {
    window.location.href = '/Recherche?r=' + groupe
  }else{
    window.location.href = '/Recherche'; 
  }
  
}
}

</script>



<template>
  <div class="flex justify-content-center mt-8" v-if="authStore.getIsLogged == false">
    <div class="surface-card p-4 shadow-2 border-round w-auto lg:w-4">
      <div class="text-center mb-5">
        <img src="../assets/linx.png" alt="Image" height="100" class="mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Application Linx</div>
      </div>
      <div>
        <div class="flex justify-content-center">
          <Button class="p-button-raised p-button-primary w-full"
            label="Utiliser le service d'authentification centralisé" style="font-weight: bold;"
            ></Button>
        </div>
        <br>

        <Accordion :activeIndex="-1" :lazy="false">
          <AccordionTab header="Authentification locale">
            <div class="p-inputgroup" style="margin-top: 5%; width: 50%;">
              <span class="p-inputgroup-addon">
                <i class="fa-solid fa-user"></i>
              </span>
              <InputText placeholder="Nom d'utilisateur" />
            </div>
            <div class="p-inputgroup" style="margin-top: 5%; width: 50%;">
              <span class="p-inputgroup-addon">
                <i class="pi pi-lock"></i>
              </span>
              <InputText placeholder="Mot de passe" />
            </div>
            <br>
            <div class="flex justify-content-center">
              <Button class="p-button-raised p-button-secondary w-full" label="Se connecter"
                style="max-width: 50%; font-weight: bold;"></Button>
            </div>


          </AccordionTab>
        </Accordion>

      </div>
    </div>
  </div>


  <div v-else>
    <div>
      <BreadCrumbVue :items="myItems" :home="myHome"></BreadCrumbVue>
      <div class="surface-ground p-4 text-center">
        <img src="../assets/linx.png" alt="Image" height="100" class="mb-3 align-content-center">
        <div class="flex justify-content-center mt-2">
          <div class="surface-card p-5 border-round w-auto lg:w-5 shadow-1">
            <InputText v-model="message" placeholder="Rechercher" type="text" class="w-full"
              @keyup.enter="rechercher(message, null)" />
          </div>
        </div>
      </div>
      <div class="surface-ground px-4 py-5 md:px-6 lg:px-8">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3 cursor-pointer" @click="rechercher(null, 'z')">
            <div class="surface-card shadow-2 p-3 border-round  hover:shadow-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">Zones</span>
                  <div class="text-900 font-medium text-xl" v-if="zones">{{ zones.data.zone_list.length }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style="width:2.5rem;height:2.5rem">
                  <i class="fa-solid fa-location-dot text-blue-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3 cursor-pointer" @click="rechercher(null, 'b')">
            <div class="surface-card shadow-2 p-3 border-round  hover:shadow-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">Bâtiments</span>
                  <div class="text-900 font-medium text-xl" v-if="batiments">{{ batiments.data.batiment_list.length }}
                  </div>
                </div>
                <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                  style="width:2.5rem;height:2.5rem">
                  <i class="fa fa-building text-orange-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3 cursor-pointer" @click="rechercher(null, 's')">
            <div class="surface-card shadow-2 p-3 border-round hover:shadow-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">Salles</span>
                  <div class="text-900 font-medium text-xl" v-if="salles">{{ salles.data.salle_list.length }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style="width:2.5rem;height:2.5rem">
                  <i class="fa-solid fa-chair text-cyan-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3 cursor-pointer" @click="rechercher(null, 'e')">
            <div class="surface-card shadow-2 p-3 border-round hover:shadow-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">Equipements</span>
                  <div class="text-900 font-medium text-xl" v-if="equipements">{{ equipements.data.association_list.length
                  }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                  style="width:2.5rem;height:2.5rem">
                  <i class="fa fa-clipboard-list text-purple-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div></template>


<style scoped></style>
