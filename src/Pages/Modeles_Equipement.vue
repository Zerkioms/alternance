
<script setup>
import ModeleEquipementController from "../Controllers/ModeleEquipementController";
import CaracteristiquesController from "../Controllers/CaracteristiquesController";
import DataModeleController from "../Controllers/DataModeleController";
import TypeEquipementController from '../Controllers/TypeEquipementController';

import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";

import {useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authStore = useAuthStore()

const toast = useToast()

const input_marque = ref()
const input_modele = ref()
const input_dispo_vente = ref(false)
const selected_modele_equipement = ref()
const selected_type_equipement = ref()
const selected_caracteristiques = ref([])



//On récupère les modèles d'équipements
const modeles_equipements = ref(null)
onMounted(async () => {
  if (!modeles_equipements.value) {
    ModeleEquipementController.fetchAllModeleEquipements(apiClient).then((response) => {
      modeles_equipements.value = response.data.modeles_list;
    });
  }
})

//On récupère les types d'équipements
const types_equipements = ref(null)
onMounted(async () => {
  if (!types_equipements.value) {
    TypeEquipementController.fetchAllTypeEquipement(apiClient).then((response) => {
      types_equipements.value = response.data.type_equipement_list;
    });
  }
})

//On récupère les caractéristiques non modifiables
const caracteristiques_non_modifiables = ref(null)
onMounted(async () => {
  if (!caracteristiques_non_modifiables.value) {
    CaracteristiquesController.fetchAllCaracteristiquesNonModifiable(apiClient).then((response) => {
      caracteristiques_non_modifiables.value = response.data.caracteristique_non_modifiable_list;
    });
  }
})

//Fonction de création de modèle d'équipement
function createModeleEquipement() {
  ModeleEquipementController.createModeleEquipement(apiClient, input_marque.value, input_modele.value, input_dispo_vente.value, selected_type_equipement.value.id).then((response) => {
    if (response.data.Modele_equipement != null) {
      for(let i = 0; i < selected_caracteristiques.value.length; i++){
        DataModeleController.createDataModele(apiClient, selected_caracteristiques.value[i].id, response.data.Modele_equipement.id).then((response) => {
        });
      }
      ModeleEquipementController.fetchAllModeleEquipements(apiClient).then((response) => {
        modeles_equipements.value = response.data.modeles_list;
        displayCreateDialog.value = false;
      toast.add({ severity: "success", summary: "Succès", detail: "Modèle d'équipement créé", life: 3000 });
      input_marque.value = null
      input_modele.value = null
      input_dispo_vente.value = false
      selected_caracteristiques.value = []

      });


    }
  });
}
//Fonction de suppression de modèle d'équipement
function deleteModeleEquipement() {
  DataModeleController.deleteCaracteristiquesByModele(apiClient, selected_modele_equipement.value.id).then((response) => {
    if (response.data.destroyed >= 0) {
      ModeleEquipementController.deleteModeleEquipement(apiClient, selected_modele_equipement.value.id).then((response) => {
        let index = modeles_equipements.value.indexOf(selected_modele_equipement.value.id);
        modeles_equipements.value.splice(index, 1);
        displayDeleteDialog.value = false;
        toast.add({ severity: "success", summary: "Succès", detail: "Modèle d'équipement supprimé", life: 3000 });
      });
    }
  });
}

//Fonction d'édition de modèle d'équipement
function editModeleEquipement() {
  ModeleEquipementController.editModeleEquipement(apiClient, selected_modele_equipement.value.id, selected_modele_equipement.value.marque, selected_modele_equipement.value.modele, selected_modele_equipement.value.dispo_vente, selected_modele_equipement.value.type_equipement.id).then((response) => {
    if (response.data.updated == 1) {
      ModeleEquipementController.fetchAllModeleEquipements(apiClient).then((response) => {
        modeles_equipements.value = response.data.modeles_list;
        displayEditDialog.value = false;
      toast.add({ severity: "success", summary: "Succès", detail: "Modèle d'équipement modifié", life: 3000 });
      });
    }
  });
}

//Fonctions pour afficher les formulaires
const displayCreateDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);

//Fonction pour afficher le formulaire de création
function openCreateDialog() {
  displayCreateDialog.value = true;

}

//Fonction pour afficher le formulaire d'édition
function openEditDialog(selected) {
  displayEditDialog.value = true;
  selected_modele_equipement.value = selected;
}

//Fonction pour afficher le formulaire de suppression
function openDeleteDialog(selected) {
  displayDeleteDialog.value = true;
  selected_modele_equipement.value = selected;
}

const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})


const myItems = ref([])

watch(modeles_equipements, async (newModeles_equipements, oldZone) => {
  if(newModeles_equipements != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Modèles d\'équipements',
        to: '/Modeles_Equipement'
      }
    ]
  }
  return myItems.value
})
</script>


<template>
<div>
  <BreadCrumbVue :items="myItems" :home="myHome" v-if="modeles_equipements"></BreadCrumbVue>
    <Toast />
    <DataTable :value="modeles_equipements" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10" v-if="modeles_equipements">
      <template #header>
        <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="modeles_equipements">Liste des modèles</span>
            <div class="flex">
              <Button label="Ajouter un modèle" class="p-button-success w-14rem" icon="pi pi-plus" @click="openCreateDialog"></Button>
            </div>
          </div>
          </template>
          <template #empty> <div class="text-center m-4">Aucun modèle.</div></template>
      <Column field="marque" header="Marque" :sortable="true"></Column>
      <Column field="modele" header="Modèle" :sortable="true"></Column>
      <Column header="Disponible à la vente" :sortable="true">
        <template #body="slotProps">
          <i class="fa-solid fa-check" v-if="slotProps.data.dispo_vente"></i>
        </template>
      </Column>
      <Column field="id_type_equipement" header="Type d'équipement" :sortable="true">
          <template #body="slotProps">
            <span v-html="slotProps.data.type_equipement?.icon"></span> {{slotProps.data.type_equipement?.nom}}
          </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-wrap flex-row">
            <div class="flex align-items-center justify-content-center">
          <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text" @click="openEditDialog(slotProps.data)"/>
          <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text" @click="openDeleteDialog(slotProps.data)" />
          </div>
          </div>
        </template>
      </Column>
      <Column>
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">
            <div class="flex align-items-center justify-content-center">
        <router-link :to="({name: 'CaracteristiquesModele', params:{id: slotProps.data.id}})">
            <Button label="Caractéristiques" icon="fa-solid fa-gear" class="p-button-primary p-button-outlined p-button-sm p-button" :badge=" slotProps.data.data_modeles.length.toString()" v-if="slotProps.data.data_modeles" badgeClass="p-badge-info"/>
          </router-link>
          </div>
          </div>
          </template>
      </Column>
    </DataTable>




    <Dialog header="Ajouter un modèle" v-model:visible="displayCreateDialog" :modal="true" :closable="false"
      :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }"> 
         <div class="fluid formgrid grid">
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="marque" v-model="input_marque" class="w-full" :class="{ 'p-invalid': input_marque == null || input_marque == '' }"/>
            <label for="marque">Nom de la marque</label>
          </span>
          </div>
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <InputText id="modele" v-model="input_modele" class="w-full" :class="{ 'p-invalid': input_modele == null || input_modele == '' }"/>
            <label for="modele">Nom du modèle</label>
          </span>
          </div>
    </div>
    <div class="fluid formgrid grid">
      <div class="col-6 field">
        <Dropdown v-model="selected_type_equipement" :options="types_equipements" optionLabel='nom' placeholder="Choisir un type d'équipement" class="w-full" :class="{ 'p-invalid': selected_type_equipement == null || selected_type_equipement == '' }"/>
      </div>
      <div class="col-6 field">
        <ToggleButton v-model="input_dispo_vente" onLabel="Disponible à la vente" offLabel="Indisponible à la vente" class="p-button-primary w-full" />
      </div>
    </div>
    <div class="fluid formgrid grid">
      <div class="col-12 field">
        <MultiSelect v-model="selected_caracteristiques" :options="caracteristiques_non_modifiables" optionLabel="grandeur" placeholder="Choisir des caractéristiques" :filter="true" class="w-full">
          <template #value="slotProps">
            <div v-for="option of slotProps.value" :key="option.grandeur">
              <div>{{option.grandeur}}</div>
            </div>
            <template v-if="!slotProps.value || slotProps.value.length === 0">
              Choisir Caractéristique
            </template>
          </template>
          <template #option="slotProps">
            <div>
              <div>{{slotProps.option.grandeur}}</div>
            </div>
          </template>
        </MultiSelect>
      </div>
    </div>
    <template #footer>
      <div class="formgrid grid">
          <div class="col-12">
      <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false"/>
      <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_marque == null || input_modele == null || selected_type_equipement == nul || input_marque == '' || input_modele == '' || selected_type_equipement == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createModeleEquipement" v-else autofocus />
      </div>
      </div>
    </template>
  </Dialog>


  <Dialog v-model:visible="displayDeleteDialog" :style="{width: '450px'}" header="Supprimer le modèle" :modal="true">

      <span v-if="selected_modele_equipement">Êtes-vous sûr de vouloir <b>supprimer</b> le modèle d'équipement ?</span>
    <template #footer>
      <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false"/>
      <Button label="Supprimer" icon="pi pi-check" class="p-button-primary" @click="deleteModeleEquipement()" />
        </div>
      </div>
    </template>
  </Dialog>


  <Dialog header="Modifier le modèle" v-model:visible="displayEditDialog" :modal="true" :closable="false"
      :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }"> 
         <div class="fluid formgrid grid">
          <div class="col-6 field">
            <InputText id="modele" v-model="selected_modele_equipement.marque" class="w-full" placeholder="Marque" />
          </div>
          <div class="col-6 field">
            <InputText id="modele" v-model="selected_modele_equipement.modele" class="w-full" placeholder="Modèle" />
          </div>
    </div>
    <div class="fluid formgrid grid">
      <div class="col-6 field">
        <Dropdown v-model="selected_modele_equipement.type_equipement" :options="types_equipements" optionLabel='nom' placeholder="Choisir un type d'équipement" class="w-full" />
      </div>
      <div class="col-6 field">
        <ToggleButton v-model="selected_modele_equipement.dispo_vente" onLabel="Disponible à la vente" offLabel="Indisponible à la vente" class="p-button-primary w-full" />
      </div>
    </div>
    <template #footer>
      <div class="formgrid grid">
          <div class="col-12">
      <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayEditDialog = false"/>
      <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editModeleEquipement()" />
      </div>
      </div>
    </template>
  </Dialog>

  
</div>
</template>

<style scoped>
</style>