 <script setup>

import ZoneController from "../Controllers/ZoneController.js";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from 'vue'
import Toast from "primevue/toast";

import {useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authStore = useAuthStore()

const toast = useToast();

const input_libelle_court = ref()
const input_libelle_long = ref()
const selectedZone = ref(null)
const zones = ref(null);

onMounted(async () => {
  if (!zones.value) {
    await ZoneController.fetchAllZones(apiClient).then(response => {
      zones.value = response.data.zone_list
    })
  }
})

const displayCreateDialog = ref(false)
const displayDeleteDialog = ref(false)
const displayEditDialog = ref(false)
const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})
const myItems = ref([])
myItems.value = [
  {
    label: 'Zones',
    to: '/Zones'
  },
]



function createZone() {
  ZoneController.createZone(apiClient, input_libelle_court.value, input_libelle_long.value).then(response => {
    if (response.data != null) {
      //zones.value.push(response.data.Zone)
      ZoneController.fetchAllZones(apiClient).then(response => {
        zones.value = response.data.zone_list
      })
      displayCreateDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Zone créee", life: 3000 });
      input_libelle_court.value = null
      input_libelle_long.value = null
    }
  })
}

function deleteZone() {
  if (selectedZone.value.batiments.length==0) {
  ZoneController.deleteZone(apiClient, selectedZone.value.id).then(response => {
    if (response.data.destroyed == 1) {
      let index = zones.value.indexOf(selectedZone.value);
      zones.value.splice(index, 1);
      displayDeleteDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Zone supprimée", life: 3000 });
      selectedZone.value = null
    }
  })
}else{
  displayDeleteDialog.value = false
    toast.add({ severity: 'info', summary: 'Attention', detail: "Il éxiste des batiments associées à cette zone", life: 3000 });
      selectedZone.value = null
}
}
function editZone() {
  ZoneController.editZone(apiClient, selectedZone.value.id_zone, selectedZone.value.libelle_court, selectedZone.value.libelle_long).then(response => {
    if (response.data.updated == 1) {
      let index = zones.value.indexOf(selectedZone.value);
      zones.value.splice(index, 1);
      ZoneController.fetchZoneById(apiClient, selectedZone.value.id_zone).then(response => {
        zones.value.push(response.data.zone)
      })
      displayEditDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Zone modifiée", life: 3000 });
      selectedZone.value = null
    }
  })
}
function openCreateDialog() {
  displayCreateDialog.value = true
}


function openDeleteDialog(zone) {
  displayDeleteDialog.value = true
  selectedZone.value = zone
}

function openEditDialog(zone) {
  displayEditDialog.value = true
  selectedZone.value = zone
}


</script>
    
 
<template>
  <div>
    <BreadCrumbVue :items="myItems" :home="myHome"></BreadCrumbVue>
    <Toast />
    <!--TABLEAU DE ZONES SOUS FORMES DE CARTES-->
    <div>
      <DataTable :value="zones" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm"
        :paginator="true" :rows="10" v-if="zones">
        <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="zones">Liste des zones</span>
            <div class="flex">
              <Button label="Ajouter une zone" class="p-button-success w-13rem" icon="pi pi-plus"
                @click="openCreateDialog" v-if="authStore.isAdmin"></Button>
            </div>
          </div>
        </template>
        <template #empty> <div class="text-center m-4">Aucune zone.</div></template>
        <Column field="libelle_court" header="Code" :sortable="true"></Column>
        <Column field="libelle_long" header="Zone" :sortable="true"></Column>
        <Column field="id" header="Actions" v-if="authStore.isAdmin">
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">

              <div class="flex align-items-center justify-content-center">
                <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text"
                  @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              </div>
              <div class="flex align-items-center justify-content-center">
                <Button icon="fa-solid fa-trash" class=" p-button-danger p-button-text"
                  @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              </div>

            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">
              <div class="flex align-items-center justify-content-center">
                <router-link :to="({ name: 'Batiments', params: { id_zone: slotProps.data.id_zone } })" class="pr-2"
                  style="text-decoration: none; color:#2c3e50">
                  <Button type="button" label="Bâtiments" icon="fa fa-building"
                    class="p-button-primary p-button-outlined p-button-sm p-button"
                    :badge="slotProps.data.batiments.length.toString()" v-if="slotProps.data.batiments"
                    badgeClass="p-badge-info" />
                </router-link>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>

      <!--POPUP AJOUT ZONE-->




      <Dialog header="Ajouter une zone" v-model:visible="displayCreateDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-8 mt-4">
            <span class="p-float-label">
            <InputText id="libelle_long" type="text" v-model="input_libelle_long" class="w-full"
              :class="{ 'p-invalid': input_libelle_long == null || input_libelle_long == '' }"></InputText>
              <label for="libelle_long">Nom complet de la zone</label>
            </span>
            <small id="libelle_long" class="p-error" v-if="input_libelle_long == null || input_libelle_long == ''">Un nom
              est nécessaire</small>
          </div>
          <div class="col-4 mt-4">
            <span class="p-float-label">
            <InputText id="libelle_court" type="text" v-model="input_libelle_court" class="w-full"
              :class="{ 'p-invalid': input_libelle_court == null || input_libelle_court == '' }"></InputText>
              <label for="libelle_court">Code de la zone</label>
            </span>
            <small id="libelle_court" class="p-error" v-if="input_libelle_court == null || input_libelle_court == ''">Un
              nom est nécessaire</small>
          </div>
        </div>
        <template #footer>
          <div class="formgrid grid">
            <div class="col-12">
              <Button label="Annuler" icon="pi pi-times" @click="displayCreateDialog = false" class="p-button-text" />
              <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_libelle_court == null || input_libelle_long == null || input_libelle_long == '' || input_libelle_court == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createZone" v-else autofocus />
            </div>
          </div>
        </template>
      </Dialog>






      <!--POPUP SUPPRESSION ZONE-->

      <Dialog header="Supprimer une zone" v-model:visible="displayDeleteDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <p>Êtes-vous sûr de vouloir <b>supprimer</b> cette zone ?</p>
        <template #footer>
          <Button label="Annuler" icon="pi pi-times" @click="displayDeleteDialog = false" class="p-button-text" />
          <Button label="Supprimer" icon="pi pi-check" @click="deleteZone(selectedZone)" autofocus />
        </template>
      </Dialog>


      <!--POPUP EDITION ZONE-->

      <Dialog header="Éditer une zone" v-model:visible="displayEditDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-8 mt-4">
            <span class="p-float-label">
            <InputText id="edit_libelle_long" type="text" v-model="selectedZone.libelle_long" class="w-full"
              :class="{ 'p-invalid': selectedZone.libelle_long == null || selectedZone.libelle_long == '' }"></InputText>
              <label for="edit_libelle_long">Nom complet de la zone</label>
              </span>
              <small id="edit_libelle_long" class="p-error"
                v-if="selectedZone.libelle_long == null || selectedZone.libelle_long == ''">Un nom est nécessaire</small>
          </div>
          <div class="col-4 mt-4">
            <span class="p-float-label">
            <InputText id="edit_libelle_court" type="text" v-model="selectedZone.libelle_court" class="w-full"
              :class="{ 'p-invalid': selectedZone.libelle_court == null || selectedZone.libelle_court == '' }">
            </InputText>
            <label for="edit_libelle_court">Code de la zone</label>
            </span>
            <small id="edit_libelle_court" class="p-error"
              v-if="selectedZone.libelle_court == null || selectedZone.libelle_court == ''">Un code est
              nécessaire</small>
          </div>
        </div>
        <template #footer>
        <div class="formgrid grid">
          <div class="col-12">
            <Button label="Annuler" icon="pi pi-times" @click="displayEditDialog = false" class="p-button-text" />
            <Button label="Modifier" icon="pi pi-check" @click="editZone(selectedZone)" autofocus />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</div></template>

<style scoped></style>