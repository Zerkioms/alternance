
<script setup>
import CaracteristiquesController from "../Controllers/CaracteristiquesController";

import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";

import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authStore = useAuthStore()


const toast = useToast()

  const caracteristiques = ref()
  onMounted(async () => {
    if (!caracteristiques.value) {
      try {
        CaracteristiquesController.fetchAllCaracteristiques(apiClient).then(response => {
          caracteristiques.value = response.data.caracteristique_list
        })
      } catch (error) {
        console.log(error)
      }
    }
  })

  const input_grandeur = ref(null)
  const input_type_valeur = ref(null)
  const input_unite = ref(null)
  const input_valeur_default = ref(null)
  const input_valeur_default_affichage = ref(null)
  const input_groupement = ref(null)
  const input_modifiable = ref(null)

  const selected_caracteristique = ref(null)

  const displayCreateDialog = ref(false)
  const displayDeleteDialog = ref(false)
  const displayEditDialog = ref(false)

  function openCreateDialog() {
    displayCreateDialog.value = true
  }

  function openDeleteDialog(caracteristique) {
    selected_caracteristique.value = caracteristique
    displayDeleteDialog.value = true
  }

  function openEditDialog(caracteristique) {
    selected_caracteristique.value = caracteristique
    if (selected_caracteristique.value.valeur_default != null && selected_caracteristique.value.valeur_default != '') {
      selected_caracteristique.value.input_valeur_default_affichage = selected_caracteristique.value.valeur_default.split(";")
    }else{
      selected_caracteristique.value.input_valeur_default_affichage = null
    }
  
    displayEditDialog.value = true
  }

  function createCaracteristique() {
    if (input_valeur_default_affichage.value != null && input_valeur_default_affichage.value != ""){
      input_valeur_default.value = input_valeur_default_affichage.value.join(";")

    }else{
      input_valeur_default.value = null

    }
    if(input_modifiable.value == null) {
      input_modifiable.value = false
    }
    
    CaracteristiquesController.createCaracteristique(apiClient, input_grandeur.value, input_type_valeur.value, input_unite.value, input_valeur_default.value, input_groupement.value, input_modifiable.value).then(response => {
      if (response.data.caracteristique) {
        CaracteristiquesController.fetchAllCaracteristiques(apiClient).then(response => {
          caracteristiques.value = response.data.caracteristique_list
          toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique ajoutée", life: 3000 });
          displayCreateDialog.value = false
          input_grandeur.value = null
          input_type_valeur.value = null
          input_unite.value = null
          input_valeur_default.value = null
          input_valeur_default_affichage.value = null
          input_groupement.value = null
          input_modifiable.value = false
        })
      }
    })
  }


  function deleteCaracteristique() {
    CaracteristiquesController.deleteCaracteristiqueById(apiClient, selected_caracteristique.value.id).then(response => {
      if (response.data.destroyed) {
        let index = caracteristiques.value.indexOf(selected_caracteristique.value)
        caracteristiques.value.splice(index, 1)
        displayDeleteDialog.value = false
        toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique supprimée", life: 3000 });
      }
    })
  }

  function editCaracteristique() {
    if (selected_caracteristique.value.input_valeur_default_affichage != null && selected_caracteristique.value.input_valeur_default_affichage != ""){
      selected_caracteristique.value.valeur_default = selected_caracteristique.value.input_valeur_default_affichage.join(";")

    }else{
      selected_caracteristique.value.valeur_default = null

    }
    
    CaracteristiquesController.updateCaracteristiqueById(apiClient, selected_caracteristique.value.id, selected_caracteristique.value.grandeur, selected_caracteristique.value.type_valeur, selected_caracteristique.value.unite, selected_caracteristique.value.valeur_default, selected_caracteristique.value.groupement, selected_caracteristique.value.modifiable).then(response => {
      if (response.data.updated) {
        CaracteristiquesController.fetchAllCaracteristiques(apiClient).then(response => {
          caracteristiques.value = response.data.caracteristique_list
        })
        displayEditDialog.value = false
        toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique modifiée", life: 3000 });
      }
    })
  }

  const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})


const myItems = ref([])

watch(caracteristiques, async (newCaracteristiques, oldZone) => {
  if(newCaracteristiques != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Caracteristiques',
        to: '/Caracteristiques'
      }
    ]
  }
  return myItems.value
})

//make a list called types_valeurs
const types_valeurs = ref([
  {label: 'Texte', value: 'Texte'},
  {label: 'Numérique', value: 'Numérique'},
  {label: 'Mail', value: 'Mail'},
  {label: 'Lien Web', value: 'Lien Web'},
  {label: 'Adresse IP', value: 'Adresse IP'},
  {label: 'Adresse MAC', value: 'Adresse MAC'},
  {label: 'Date', value: 'Date'},
])
</script>



<template>
  <div v-if="authStore.isAdmin">
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="caracteristiques"></BreadCrumbVue>
      <Toast />
    <div>
    <DataTable :value="caracteristiques" stripedRows responsiveLayout="stack" rowGroupMode="rowspan" groupRowsBy="groupement"
                sortMode="single" sortField="groupement" :sortOrder="1" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10"  v-if="caracteristiques">
      <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="caracteristiques">Liste des caractéristiques</span>
            <div class="flex">
          <Button label="Ajouter une caractéristique" class="p-button-success" icon="pi pi-plus" @click="openCreateDialog()" v-if="authStore.isAdmin"></Button>
            </div>
          </div>
       </template>
       <template #empty> <div class="text-center m-4">Aucune caractéristique.</div></template>
       <Column field="groupement" header="Groupement"></Column>
      <Column field="grandeur" header="Grandeur" :sortable="true"></Column>
      <Column field="type_valeur" header="Type de valeur" :sortable="true"></Column>
      <Column field="unite" header="Unité de mesure" :sortable="true"></Column>
      <Column header="Valeurs par default" :sortable="true">
            <template #body="slotProps">
              <div v-if="slotProps.data.valeur_default!= null">
                <Chip class="mr-1" v-bind:key="item"  v-for="item in slotProps.data.valeur_default.split(';')" :label="item" />
              </div>
            </template>
          </Column>
      <Column header="modifiable ?" :sortable="true">
        <template #body="slotProps">
          <i class="fa-solid fa-check" v-if="slotProps.data.modifiable"></i>
        </template>
      </Column>
      <Column header="Actions" bodyStyle="align-content:center">
        <template #body="slotProps">
          <Button icon="fa-solid fa-pencil" class=" p-button-warning p-button-text" @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
          <Button icon="fa-solid fa-trash" class=" p-button-danger p-button-text" @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
        </template>
      </Column>
      <template #footer>
      </template>
    </DataTable>





      <Dialog v-model:visible="displayDeleteDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
        <div class="confirmation-content">
          <span>Êtes-vous sûr de vouloir <b>supprimer</b> cette caractéristique ?</span>
        </div>
        <template #footer>
          <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false"/>
          <Button label="Supprimer" icon="pi pi-check" class="p-button-primary" @click="deleteCaracteristique(selected_caracteristique)" />
        </template>
      </Dialog>





      <Dialog v-model:visible="displayEditDialog" :style="{width: '450px'}" header="Éditer la caractéristique" :modal="true" class="p-fluid">
        <div class="fluid formgrid grid">
          <div class=" col-12 field mt-4">
            <span class="p-float-label">
            <InputText id="grandeur" v-model="selected_caracteristique.grandeur" class="w-full"/>
            <label for="grandeur">Grandeur</label>
          </span>
          </div>
          <div class="col-6 field mt-4">
            <span class="p-float-label">
            <Dropdown :options="types_valeurs" v-model="selected_caracteristique.type_valeur" optionLabel="label" optionValue="value" class="w-full"/>
            <label for="input_type_valeur">Type de valeur</label>
          </span>
        </div>
        <div class="col-6 field mt-4">
          <span class="p-float-label">
          <InputText id="unite" v-model="selected_caracteristique.unite" class="w-full"/>
          <label for="unite">Unité de mesure</label>
        </span>
        </div>
        </div>
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
              <Chips v-model="selected_caracteristique.input_valeur_default_affichage" separator=";"  />
   <!--        <InputText id="valeur_default" v-model="selected_caracteristique.valeur_default" class="w-full" />--> 
            <label for="input_valeur_default">Valeur par défault</label>
          </span>
          </div>
          <div class="col-12 field mt-4">
            <span class="p-float-label">
            <InputText id="groupement" v-model="selected_caracteristique.groupement" class="w-full" />
            <label for="groupement">Groupement</label>
          </span>
          </div>
          <div class="col-12 field mt-4">
            <ToggleButton v-model="selected_caracteristique.modifiable" onLabel="Modifiable" offLabel="Non modifiable" class="p-button-primary" />
          </div>
        </div>
        <template #footer>
          <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayEditDialog = false"/>
          <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editCaracteristique()" />
          </div> 
        </div>
        </template>
      </Dialog>


      <Dialog v-model:visible="displayCreateDialog" :style="{width: '450px'}" header="Ajouter une caractéristique" :modal="true" class="p-fluid">
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
          <InputText id="grandeur" v-model="input_grandeur" class="w-full" :class="{ 'p-invalid': input_grandeur == null || input_grandeur == '' }"/>
          <label for="grandeur">Grandeur</label>
        </span>
        <small id="grandeur" class="p-error" v-if="input_grandeur == null || input_grandeur == ''">Une
              grandeur est nécessaire</small>
        </div>
        <div class="col-6 field mt-4">
          <span class="p-float-label">
          <Dropdown :options="types_valeurs" v-model="input_type_valeur" optionLabel="label" optionValue="value" placeholder="Type de valeur" class="w-full" :class="{ 'p-invalid': input_type_valeur == null || input_type_valeur == '' }"/>
          <label for="input_type_valeur">Type de valeur</label>
        </span>
        <small id="input_type_valeur" class="p-error" v-if="input_type_valeur == null || input_type_valeur == ''">Une
              grandeur est nécessaire</small>
        </div>
        <div class="col-6 field mt-4">
          <span class="p-float-label">
          <InputText id="unite" v-model="input_unite" class="w-full"/>
          <label for="unite">Unité de mesure</label>
        </span>
        </div>
        </div>
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
              <Chips v-model="input_valeur_default_affichage" separator=";"  />
        <!--    <InputText id="valeur_default" v-model="input_valeur_default" class="w-full" />-->
            <label for="input_valeur_default">Valeur par défault</label>
          </span>
          </div>
          <div class="col-12 field mt-4">
            <span class="p-float-label">
            <InputText id="groupement" v-model="input_groupement" class="w-full" />
            <label for="groupement">Groupement</label>
          </span>
          </div>
          <div class="col-12 field mt-4">
            <ToggleButton v-model="input_modifiable" onLabel="Modifiable" offLabel="Non modifiable" class="p-button-primary" />
          </div>
        </div>
          <template #footer>
            <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false"/>
          <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_grandeur == null || input_type_valeur == null || input_grandeur == '' || input_type_valeur == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createCaracteristique" v-else autofocus />
          </div>
          </div>
        </template>
      </Dialog>





    </div>
  </div>
</template>


<style scoped>

</style>