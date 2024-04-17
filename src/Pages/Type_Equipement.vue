
<script setup>
import TypeEquipementController from "../Controllers/TypeEquipementController";

import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";

import { useAuthService, useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authService = useAuthService()
const authStore = useAuthStore()

const toast = useToast();

const types_equipement = ref(null);
const input_type_equipement = ref(null);
const input_icon = ref(null);
const selected_type = ref(null);


onMounted(async () => {
  if (!types_equipement.value) {
    TypeEquipementController.fetchAllTypeEquipement(apiClient).then(response => {
      types_equipement.value = response.data.type_equipement_list;
    })
  }
})

const displayCreateDialog = ref(false);
const displayDeleteDialog = ref(false);
const displayEditDialog = ref(false);

function createTypeEquipement() {
  TypeEquipementController.createTypeEquipement(apiClient, input_type_equipement.value, input_icon.value).then(response => {
    if(response.data.Type_Equipement != null) {
      types_equipement.value.push(response.data.Type_Equipement)
      displayCreateDialog.value = false
      toast.add({severity:'success', summary: 'Succès', detail: "Type d'équipement créé", life: 3000});
    }
  })
}

function deleteTypeEquipement() {
  TypeEquipementController.deleteTypeEquipement(apiClient, selected_type.value.id).then(response => {
    if(response.data.destroyed == 1) {
      let index = types_equipement.value.indexOf(selected_type.value);
        types_equipement.value.splice(index, 1);
      displayDeleteDialog.value = false
      toast.add({severity:'success', summary: 'Succès', detail: "Type d'équipement supprimé", life: 3000});
    }
  })
}

function editTypeEquipement() {
    TypeEquipementController.editTypeEquipement(apiClient, selected_type.value.id, selected_type.value.nom, selected_type.value.icon).then(response => {
      if(response.data.updated != null) {
        TypeEquipementController.fetchAllTypeEquipement(apiClient).then(response => {
          types_equipement.value = response.data.type_equipement_list;
        })
        displayEditDialog.value = false
        toast.add({severity:'success', summary: 'Succès', detail: "Type d'équipement modifié", life: 3000});
      }
    })
}

function openCreateDialog() {
  displayCreateDialog.value = true
}

function openDeleteDialog(type) {
  displayDeleteDialog.value = true
  selected_type.value = type
}

function openEditDialog(type) {
  displayEditDialog.value = true
  selected_type.value = type
}

const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})


const myItems = ref([])

watch(types_equipement, async (newTypes_equipement, oldZone) => {
  if(newTypes_equipement != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Types d\'équipement',
        to: '/type_equipement'
      }
    ]
  }
  return myItems.value
})

</script>


<template>
  <div v-if="authStore.isAdmin">
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="types_equipement"></BreadCrumbVue>
    <Toast />
        <DataTable :value="types_equipement" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10" v-if="authStore.isAdmin && types_equipement">
          <template #header>
            <div class="flex justify-content-between flex-wrap card-container">
              <span class="flex align-items-center" v-if="types_equipement">Liste des types d'équipement</span>
              <div class="flex">
                <Button label="Ajouter un type d'équipement" class="p-button-success w-20rem" icon="pi pi-plus" @click="openCreateDialog()" v-if="authStore.isAdmin" ></Button>
              </div>
            </div>
          </template>
          <template #empty> <div class="text-center m-4">Aucun type d'équipement.</div></template>
          <Column field="nom" header="Type d'équipement" :sortable="true"></Column>
          <Column field="icon" header="Icone">
            <template #body="slotProps">
              <div v-html="slotProps.data.icon"></div>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text" @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text" @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
            </template>
          </Column>
        </DataTable>






    <Dialog v-model:visible="displayDeleteDialog" :style="{width: '450px'}" header="Supprimer le type d'équipement" :modal="true" v-if="authStore.isAdmin">
      <div class="confirmation-content">
        <span v-if="selected_type">Êtes-vous sûr de vouloir <b>supprimer</b> le type d'équipement ?</span>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false"/>
        <Button label="Supprimer" icon="pi pi-check" class="p-button-primary" @click="deleteTypeEquipement()" />
      </template>
    </Dialog>


    <Dialog header="Éditer le type d'équipement" v-model:visible="displayEditDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
        <InputText id="nom" v-model="selected_type.nom" autofocus class="w-full" :class="{ 'p-invalid': selected_type.nom == null || selected_type.nom == '' }"/>
        <label for="nom">Nom du type d'équipement</label>
      </span>
      <small id="input_libelle" class="p-error"
              v-if="selected_type.nom == null || selected_type.nom == ''">Un nom est
              nécessaire</small>
        </div>
        <div class="col-12 field mt-4">
          <span class="p-float-label">
        <InputText id="icon" v-model="selected_type.icon" autofocus class="w-full"/>
        <label for="icon">Icone du type d'équipement</label>
      </span>
        </div>
        </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12"> 
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayEditDialog = false"/>
        <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editTypeEquipement" />
        </div>
        </div>
      </template>
    </Dialog>


    <Dialog header="Ajouter un type d'équipement" v-model:visible="displayCreateDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
        <InputText id="nom" v-model="input_type_equipement" autofocus class="w-full" :class="{ 'p-invalid': input_type_equipement == null || input_type_equipement == '' }"/>
        <label for="nom">Nom du type d'équipement</label>
        </span>
        <small id="input_libelle" class="p-error"
              v-if="input_type_equipement == null || input_type_equipement == ''">Un nom est
              nécessaire</small>
        </div>
        <div class="col-12 field mt-4">
          <span class="p-float-label">
        <InputText id="icon" v-model="input_icon" autofocus class="w-full"/>
        <label for="icon">Icone du type d'équipement</label>
        </span>
        </div>
        </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12 field"> 
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false"/>
        <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_type_equipement == null || input_type_equipement == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createTypeEquipement" v-else autofocus />
        </div>
        </div>
      </template>
    </Dialog>

  </div>
  </template>

<style scoped>
</style>