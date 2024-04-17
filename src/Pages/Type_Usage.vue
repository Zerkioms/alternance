<script setup>
import { useAuthService, useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../stores/authStore.js";
import TypeUsageController from "../Controllers/TypeUsageController";
import { ref } from 'vue'
import { onMounted } from "@vue/runtime-core";
import Toast from "primevue/toast";

const apiClient = useApiClient();
const authStore = useAuthStore();

const toast = useToast();
const types_usage = ref(null)
const selected_type = ref(null);
const input_type_usage = ref(null)
onMounted(async () => {
    if(!types_usage.value) {
        TypeUsageController.fetchAllTypeUsage(apiClient).then(response => {
            types_usage.value = response.data.type_usage_list
        })
    }
})


const displayCreateDialog = ref(false);
const displayDeleteDialog = ref(false);
const displayEditDialog = ref(false);


function createTypeUsage() {
  TypeUsageController.createTypeUsage(apiClient, input_type_usage.value).then(response => {
    if(response.data.Type_Usage != null) {
      types_usage.value.push(response.data.Type_Usage)
      displayCreateDialog.value = false
      toast.add({severity:'success', summary: 'Succès', detail: "Type d'usage créé", life: 3000});
      input_type_usage.value = null;
    }
  })
}

function deleteTypeUsage(selected_type) {
  TypeUsageController.deleteTypeUsage(apiClient, selected_type.id).then(response => {
    if(response.data.destroyed == 1) {
      let index = types_usage.value.indexOf(selected_type.value);
        types_usage.value.splice(index, 1);
      displayDeleteDialog.value = false
      toast.add({severity:'success', summary: 'Succès', detail: "Type d'usage supprimé", life: 3000});
    }
  })
}

function editTypeUsage() {
    TypeUsageController.editTypeUsage(apiClient, selected_type.value.id, selected_type.value.fonctionnalite).then(response => {
      if(response.data.updated != null) {
        TypeUsageController.fetchAllTypeUsage(apiClient).then(response => {
          types_usage.value = response.data.type_usage_list;
        })
        displayEditDialog.value = false
        toast.add({severity:'success', summary: 'Succès', detail: "Type d'usage modifié", life: 3000});
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

</script>

<template>
    <div>
        <Toast />
        <DataTable :value="types_usage" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10">
            <template #header>
                <div class="flex justify-content-between flex-wrap card-container">
                    <span class="flex align-items-center" v-if="types_usage">Liste des types d'usages</span>
                    <div class="flex">
                        <Button label="Ajouter un type d'usage" class="p-button-success w-20rem" icon="pi pi-plus" @click="openCreateDialog"></Button>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="text-center m-4">Aucun type d'usage existant.</div>
            </template>
            <Column field="fonctionnalite" header="usage" :sortable="true"></Column>
            <Column header="Actions">
            <template #body="slotProps">
              <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text" @click="openEditDialog(slotProps.data)" v-if="authStore.isAdmin"/>
              <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text" @click="openDeleteDialog(slotProps.data)" v-if="authStore.isAdmin"/>
            </template>
          </Column>
        </DataTable>


        <Dialog header="Ajouter un type d'usage" v-model:visible="displayCreateDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
        <Textarea id="nom" v-model="input_type_usage" autofocus class="w-full" :class="{ 'p-invalid': input_type_usage == null || input_type_usage == '' }" rows="5" cols="30" />
        <label for="nom">Type d'usage</label>
        </span>
        <small id="input_libelle" class="p-error"
              v-if="input_type_usage == null || input_type_usage == ''">Le contenu ne peut pas être vide.</small>
        </div>
        </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12 field"> 
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false"/>
        <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_type_usage == null || input_type_usage == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createTypeUsage" v-else autofocus />
        </div>
        </div>
      </template>
    </Dialog>

    <Dialog header="Supprimer un type d'usage" v-model:visible="displayDeleteDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <p>Êtes-vous sûr de vouloir <b>supprimer</b> ce type d'usage ?</p>
        <template #footer>
          <Button label="Annuler" icon="pi pi-times" @click="displayDeleteDialog = false" class="p-button-text" />
          <Button v-model="selected_type" label="Supprimer" icon="pi pi-check" @click="deleteTypeUsage(selected_type)" autofocus />
        </template>
      </Dialog>


    <Dialog header="Éditer un type d'usage" v-model:visible="displayEditDialog" :modal="true" :closable="true"
        :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
        <div class="fluid formgrid grid">
          <div class="col-12 field mt-4">
            <span class="p-float-label">
        <Textarea id="nom" v-model="selected_type.fonctionnalite" autofocus class="w-full" :class="{ 'p-invalid': selected_type.fonctionnalite == null || selected_type.fonctionnalite == '' }" rows="5" cols="30" />
        <label for="nom">Type d'usage</label>
        </span>
        <small id="edit_fonctionnalite" class="p-error"
              v-if="selected_type.fonctionnalite == null || selected_type.fonctionnalite == ''">Le contenu ne peut pas être vide.</small>
        </div>
        </div>
      <template #footer>
        <div class="formgrid grid">
          <div class="col-12 field"> 
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayCreateDialog = false"/>
        <Button label="Éditer" icon="pi pi-check" disabled="disabled"
                v-if="selected_type.fonctionnalite == null || selected_type.fonctionnalite == ''"
                autofocus />
              <Button label="Éditer" icon="pi pi-check" @click="editTypeUsage" v-else autofocus />
        </div>
        </div>
      </template>
    </Dialog>


    </div>
</template>

