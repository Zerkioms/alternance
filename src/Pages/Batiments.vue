
<script setup>
import BatimentController from "../Controllers/BatimentController.js"

import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";

import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authStore = useAuthStore()

const route = useRoute()
const toast = useToast()

const selected_batiment = ref()
const zone = ref()

const input_libelle_court = ref()
const input_libelle_long = ref()

//On récupère les batiments
onMounted(async () => {
  if (!zone.value) {
    BatimentController.fetchBatimentsByZone(apiClient, route.params.id_zone).then((response) => {
      zone.value = response.data.batiment_list;
    });
  }
})

//Fonctions de création, modification et suppression
function createBatiment() {
  BatimentController.createBatiment(apiClient, input_libelle_court.value, input_libelle_long.value, route.params.id_zone).then(response => {
    if (response.data.Batiment != null) {
      BatimentController.fetchBatimentsByZone(apiClient, route.params.id_zone).then(response => {
        zone.value = response.data.batiment_list
        displayCreateDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Batiment créee", life: 3000 });
      input_libelle_court.value = null
      input_libelle_long.value = null
      })
    }
  })
}

function deleteBatiment() {
  if (selected_batiment.value.salles.length==0) {
    BatimentController.deleteBatiment(apiClient, selected_batiment.value.id).then(response => {
    if (response.data.destroyed == 1) {
      BatimentController.fetchBatimentsByZone(apiClient, route.params.id_zone).then(response => {
        zone.value = response.data.batiment_list
      })
      displayDeleteDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Batiment supprimée", life: 3000 });
      selected_batiment.value = null
    }
  })
}else{
  displayDeleteDialog.value = false
    toast.add({ severity: 'info', summary: 'Attention', detail: "Il éxiste des salles associées à ce batîment", life: 3000 });
    selected_batiment.value = null
}
}
function editBatiment() {
  BatimentController.editBatiment(apiClient, selected_batiment.value.id, selected_batiment.value.libelle_court, selected_batiment.value.libelle_long).then(response => {
    if (response.data.updated == 1) {
      selected_batiment.value = null
      BatimentController.fetchBatimentsByZone(apiClient, route.params.id_zone).then(response => {
        zone.value = response.data.batiment_list
      })
      displayEditDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Batiment modifiée", life: 3000 });
    }
  })
}


// Fonctions pour afficher les formulaires
let displayCreateDialog = ref(false)
var displayDeleteDialog = ref(false)
var displayEditDialog = ref(false)


function openCreateDialog() {
  displayCreateDialog.value = true
}

function openDeleteDialog(batiment) {
  displayDeleteDialog.value = true
  selected_batiment.value = batiment
}

function openEditDialog(batiment) {
  displayEditDialog.value = true
  selected_batiment.value = batiment
}

const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})


const myItems = ref([])

watch(zone, async (newZone, oldZone) => {
  if(newZone != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Zones',
        to: '/zones'
      },
      {
        label: newZone.libelle_long,
        to: '/Zones/' + newZone.id + '/Bat'
      },
    ]
  }
  return myItems.value
})



var layout = "grid"

</script>


<template>
  <div>
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="zone"></BreadCrumbVue>
    <Toast />
    <div class="flex align-content-around flex-column card-container">
      <span class="flex align-items-center text-2xl w-full" v-if="zone"> <i class="fa-solid fa-location-dot mr-3"></i> {{ zone.libelle_long }}</span>
    </div>
    <DataTable :value="zone.batiments" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm"
      :paginator="true" :rows="10" v-if="zone">
      <template #header>
        <div class="flex justify-content-between flex-wrap card-container">
          <span class="flex align-items-center" v-if="zone">Liste des bâtiments</span>
          <div class="flex">
            <Button label="Ajouter un bâtiment" class="p-button-success w-15rem" icon="pi pi-plus"
              @click="openCreateDialog" v-if="authStore.isAdmin"></Button>
          </div>
        </div>
      </template>
      <template #empty> <div class="text-center m-4">Aucun batiment.</div></template>
      <Column field="libelle_court" header="Code" :sortable="true">
      </Column>
      <Column field="libelle_long" header="Bâtiment" :sortable="true"></Column>
      <Column field="id" header="Actions" v-if="authStore.isAdmin">
        <template #body="slotProps">
          <div class="flex flex-wrap flex-row">
            <div class="flex align-items-center justify-content-center">
              <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text"
                @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
            </div>
            <div class="flex align-items-center justify-content-center">
              <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text"
                @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
            </div>
          </div>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div class="flex flex-wrap flex-row">
            <div class="flex align-items-center justify-content-center">
              <router-link :to="({ name: 'Salles', params: { id_batiment: slotProps.data.id_batiment } })">
                <Button type="button" label="Salles" icon="fa-solid fa-chair"
                  class="p-button-primary p-button-outlined p-button-sm p-button" :badge=" slotProps.data.salles.length.toString()" v-if="slotProps.data.salles" badgeClass="p-badge-info" />
              </router-link>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>


    <Dialog header="Ajouter un bâtiment" v-model:visible="displayCreateDialog" :modal="true" :closable="false"
      :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="input_libelle_long" v-model="input_libelle_long" class="w-full" :class="{ 'p-invalid': input_libelle_long == null || input_libelle_long == '' }"/>
            <label for="input_libelle_long">Nom complet du batiment</label>
          </span>
          <small id="libelle_long" class="p-error" v-if="input_libelle_long == null || input_libelle_long == ''">Un nom
              est nécessaire</small>
          </div>
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="input_libelle_court" v-model="input_libelle_court" class="w-full" :class="{ 'p-invalid': input_libelle_court == null || input_libelle_court == '' }"/>
            <label for="input_libelle_court">Code du bâtiment</label>
          </span>
          <small id="libelle_court" class="p-error" v-if="input_libelle_court == null || input_libelle_court == ''">Un code
              est nécessaire</small>
          </div>
         </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12">
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false" />
        <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_libelle_court == null || input_libelle_long == null || input_libelle_long == '' || input_libelle_court == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createBatiment" v-else autofocus />
          </div>
        </div>
      </template>
    </Dialog>


    <Dialog header="Supprimer un bâtiment" v-model:visible="displayDeleteDialog" :modal="true" :closable="true"
      :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
      <div class="p-fluid">
        <div class="p-field">
          <p>Êtes-vous sûr de vouloir <b>supprimer</b> ce batiment ?</p>
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false" />
        <Button label="Supprimer" icon="pi pi-check" class="p-button-primary"
          @click="deleteBatiment()" />
      </template>
    </Dialog>


    <Dialog header="Editer un bâtiment" v-model:visible="displayEditDialog" :modal="true" :closable="true"
      :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="input_libelle_long" v-model="selected_batiment.libelle_long" class="w-full" :class="{ 'p-invalid': selected_batiment.libelle_long == null || selected_batiment.libelle_long == '' }" @keyup.enter="editBatiment()"/>
            <label for="input_libelle_long">Nom complet du batiment</label>
          </span>
          <small id="edit_libelle_long" class="p-error"
                v-if="selected_batiment.libelle_long == null || selected_batiment.libelle_long == ''">Un nom est nécessaire</small>
          </div>
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="input_libelle_court" v-model="selected_batiment.libelle_court" class="w-full" :class="{ 'p-invalid': selected_batiment.libelle_court == null || selected_batiment.libelle_court == '' }" @keyup.enter="editBatiment()"/>
            <label for="linput_libelle_court">Code du bâtiment</label>
          </span>
          <small id="edit_libelle_court" class="p-error"
              v-if="selected_batiment.libelle_court == null || selected_batiment.libelle_court == ''">Un code est
              nécessaire</small>
          </div>
         </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12">          
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayEditDialog = false" />
        <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editBatiment()" />
          </div>
        </div>

      </template>
    </Dialog> 
</div>
</template>

<style scoped></style>