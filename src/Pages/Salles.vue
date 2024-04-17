<script setup>
import SalleController from "../Controllers/SalleController.js";
import TypeSalleController from "../Controllers/TypeSalleController.js";
import BreadCrumbVue from "../components/BreadCrumbVue.vue";

import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";

import {useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

//import {FilterMatchMode} from 'primevue/api';

const apiClient = useApiClient();
const authStore = useAuthStore()

const route = useRoute()
const toast = useToast()


      const batiment = ref();
      const type_salles = ref()
      const input_libelle = ref()
      const input_etage = ref()
      const input_type = ref()
      const selected_salle = ref()

      const displayCreateDialog = ref(false)
      const displayDeleteDialog = ref(false)
      const displayEditDialog = ref(false)



      onMounted(async () => {
        if (!batiment.value) {
          SalleController.fetchSallesByBatiment(apiClient, route.params.id_batiment).then((response) => {
            batiment.value = response.data.salle_list;
          });
        }
      })




      onMounted(async () => {
        if (!type_salles.value) {
          TypeSalleController.fetchAllTypesSalles(apiClient).then((response) => {
            type_salles.value = response.data.type_salle_list;
          });
        }
      })



      function createSalle() {
        if(input_etage.value == null || input_etage.value == "") {
          input_etage.value = 0
        }
        SalleController.createSalle(
          apiClient,
          input_libelle.value,
          input_etage.value,
          route.params.id_batiment,
          input_type.value
        ).then((response) => {
          if (response.data != null) {
            SalleController.fetchSallesByBatiment(apiClient, route.params.id_batiment).then((response) => {
              batiment.value = response.data.salle_list;
            });
            displayCreateDialog.value = false;

            input_libelle.value = null
            input_etage.value = null
            input_type.value = null

            toast.add({
              severity: "success",
              summary: "Succès",
              detail: "La salle a bien été créée",
              life: 3000,
            });

          } else {
            toast.add({
              severity: "error",
              summary: "Erreur",
              detail: "La salle n'a pas pu être créée",
              life: 3000,
            });
            displayCreateDialog.value = false;
          }
        });
      }

      function deleteSalle() {
      SalleController.deleteSalle(apiClient, selected_salle.value.id).then((response) => {
        if (response.data.destroyed == 1) {
          SalleController.fetchSallesByBatiment(apiClient, route.params.id_batiment).then((response) => {
            batiment.value = response.data.salle_list;
            displayDeleteDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Succès",
            detail: "Salle supprimée",
            life: 3000,
          });
          });
        }
      });
    }


    function editSalle() {
      SalleController.editSalle(
        apiClient,
        selected_salle.value.id,
        selected_salle.value.libelle,
        selected_salle.value.etage,
        selected_salle.value.type_salle.id
      ).then((response) => {
        if (response.data.updated == 1) {
          SalleController.fetchSallesByBatiment(apiClient, route.params.id_batiment).then((response) => {
            batiment.value = response.data.salle_list;
          });
          displayEditDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Succès",
            detail: "Salle modifiée",
            life: 3000,
          });
        }
      });
    }

      function openCreateDialog() {
        displayCreateDialog.value = true;
      }


      function openDeleteDialog(salle) {
        selected_salle.value = salle
      displayDeleteDialog.value = true;
    }

    function openEditDialog(salle) {
      selected_salle.value = salle
      displayEditDialog.value = true;
    }

    const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})

    const myItems = ref([])

watch(batiment, async (newBatiment, oldBatiment) => {
  if(newBatiment != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Zones',
        to: '/Zones'
      },
      {
        label: newBatiment.zone.libelle_long,
        to: '/Zones/' + newBatiment.zone.id + '/Bat'
      },
      {
        label: newBatiment.libelle_long,
        to: '/Zones/' + newBatiment.zone.id + '/Bat/' + newBatiment.id + '/Salles'
      },
    ]
  }
  return myItems.value
})

</script>


<template>
  <div>
      <BreadCrumbVue :items="myItems" :home="myHome" v-if="batiment"></BreadCrumbVue>
    <Toast />
    <div class="flex align-content-around flex-column card-container">
      <span class="flex align-items-center text-2xl w-full" v-if="batiment"> <i class="fa-solid fa-location-dot mr-3"></i> {{ batiment.zone.libelle_long }}</span>
      <span class="flex align-items-center text-2xl w-full mt-2" v-if="batiment"> <i class="fa-solid fa-building mr-3"></i>{{ batiment.libelle_long }}</span>
    </div>
      <DataTable :value="batiment.salles" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10" v-if="batiment">
        <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="batiment">Liste des salles</span>
            <div class="flex">
              <Button label="Ajouter une salle" class="p-button-success w-13rem" icon="pi pi-plus" @click="openCreateDialog" v-if="authStore.isAdmin"></Button>
            </div>
          </div>
        </template>
        <template #empty> <div class="text-center m-4">Aucune salle.</div></template>
        <Column field="libelle" header="Salle" :sortable="true"></Column>
        <Column field="type_salle.designation" header="Catégorie de salle" :sortable="true">
        </Column>
        <Column field="etage" header="Etage" :sortable="true"></Column>
        <Column field="id" header="Actions" v-if="authStore.isAdmin">
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">
              <div class="flex align-items-center justify-content-center">
                <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text" @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              </div>
              <div class="flex align-items-center justify-content-center">
                <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text" @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              </div>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">
              <div class="flex align-items-center justify-content-center">
                <router-link :to="({name: 'Equipements', params:{id_salle: slotProps.data.id_salle}})">
                <Button type="button" label="Détail Salle" icon="fa fa-clipboard-list" class="p-button-primary p-button-outlined p-button-sm p-button" :badge=" slotProps.data.associations.length.toString()" badgeClass="p-badge-info" />
            </router-link>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>


  <Dialog header="Ajouter une salle" v-model:visible="displayCreateDialog" :modal="true" :closable="true" :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{width: '35vw'}">
    <div class="fluid formgrid grid" >
      <div class="col-6 field mt-4">
        <span class="p-float-label">
        <InputText id="input_libelle" class="w-full" type="text" v-model="input_libelle" :class="{ 'p-invalid': input_libelle == null || input_libelle == '' }"></InputText>
        <label for="input_libelle">Nom de la salle</label>
      </span>
      <small id="input_libelle" class="p-error"
              v-if="input_libelle == null || input_libelle == ''">Un nom est
              nécessaire</small>
      </div>
      <div class="col-6 field mt-4">
        <span class="p-float-label">
        <InputNumber id="input_etage" class="w-full" type="number" v-model="input_etage"></InputNumber>
        <label for="input_etage">Etage de la salle</label>
      </span>
      </div>
      <div class="col-12 field mt-4">
        <span class="p-float-label">
        <Dropdown id="input_type" class="w-full" v-model="input_type" :options="type_salles" optionLabel="designation" optionValue="id" :class="{ 'p-invalid': input_type == null || input_type == '' }"></Dropdown>
        <label for="input_type">Catégorie de salle</label>
      </span>
      <small id="input_libelle" class="p-error"
              v-if="input_type == null || input_type == ''">Une catégorie est
              nécessaire</small>
      </div>
    </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12">
            <Button label="Annuler" icon="pi pi-times" @click="displayCreateDialog = false" class="p-button-text p-button-primary" />
            <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_libelle == null || input_type == null || input_libelle == '' || input_type == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createSalle" v-else autofocus />
          </div>
        </div>
      </template>
    </Dialog>






    <Dialog header="Supprimer la salle" v-model:visible="displayDeleteDialog" :modal="true" :closable="true" :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{width: '35vw'}">
          <div class="p-fluid">
            <div class="p-field">
              <p>Êtes-vous sûr de vouloir <b>supprimer</b> cette salle ?</p>
            </div>
          </div>
          <template #footer>
            <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false" />
            <Button label="Supprimer" icon="pi pi-check" class="p-button-primary" @click="deleteSalle()" />
          </template>
        </Dialog>






  <Dialog header="Editer la salle" v-model:visible="displayEditDialog" :modal="true" :closable="true" :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{width: '35vw'}">
    <div class="fluid formgrid grid" >
      <div class="col-6 field mt-4">
        <span class="p-float-label">
        <InputText id="input_libelle" class="w-full" type="text" v-model="selected_salle.libelle" :class="{ 'p-invalid': selected_salle.libelle == null || selected_salle.libelle == '' }"></InputText>
        <label for="input_libelle">Nom de la salle</label>
      </span>
      </div>
      <div class="col-6 field mt-4">
        <span class="p-float-label">
        <InputNumber id="input_etage" class="w-full" type="number" v-model="selected_salle.etage"></InputNumber>
        <label for="input_etage">Etage de la salle</label>
      </span>
      </div>
      <div class="col-12 field mt-4">
        <span class="p-float-label">
        <Dropdown id="input_type" class="w-full" v-model="selected_salle.type_salle.id" :options="type_salles" optionLabel="designation" optionValue="id" :class="{ 'p-invalid': selected_salle.type_salle.id == null || selected_salle.type_salle.id == '' }"></Dropdown>
        <label for="input_type">Catégorie de salle</label>
      </span>
      </div>
    </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12">
            <Button label="Annuler" icon="pi pi-times" @click="displayEditDialog = false" class="p-button-text p-button-primary" />
            <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editSalle()" autofocus />
          </div>
        </div>
      </template>
    </Dialog>

  </div>
</template>






<style scoped>

</style>