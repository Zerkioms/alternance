<script setup>
import { ref, onMounted } from 'vue'

import UserController from "../Controllers/UserController";
import ExportController from "../Controllers/ExportController";
import { useAuthStore } from "../stores/authStore.js";
import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const authStore = useAuthStore()
const apiClient = useApiClient();
const toast = useToast()


const users = ref();
const roles = ref();

onMounted(async () => {
    UserController.fetchAllUsers(apiClient).then((response) => {
        users.value = response.data.user_list
        UserController.fetchRoles(apiClient).then((response) => {
            roles.value = response.data.roles
        })
    });
});

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;
    if (newValue !== data[field]) {
        UserController.updateRole(apiClient, data.id, newValue).then((response) => {
            UserController.fetchAllUsers(apiClient).then((response) => {
                if (response.status === 200) {
                    users.value = response.data.user_list
                    toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle modifié', life: 3000 });
                } else {
                    console.log(response)
                    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification du rôle', life: 3000 });
                }
            })
        })
    }
};

const myHome = ref({
    icon: 'fa-solid fa-home',
    to: '/'
})
const myItems = ref([])
myItems.value = [
    {
        label: 'Administration',
        to: '/Administration'
    },
]

async function downloadFile(data) {
    try {
        let blob = new Blob([s2ab(data.out)],{type:"application/octet-stream"});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob)
        link.download = 'export.xlsx'
        link.click()
        URL.revokeObjectURL(link.href)
    } catch (error) {
        console.log(error)
    }
}


function exportToXLSX() {
  ExportController.exportToXLSX(apiClient).then((response) => {
    if (response.status === 200) {
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Exportation réussie', life: 3000 });
      downloadFile(response.data);
    } else {
      console.log(response)
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'exportation', life: 3000 });
    }
  })
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


</script>

<template>
    <div>
        <Toast />
        <BreadCrumbVue :items="myItems" :home="myHome"></BreadCrumbVue>
        <TabView ref="tabview">
            <TabPanel header="Gestion des utilisateurs">
                <DataTable :value="users" :paginator="true" :rows="10" :responsive="true" editMode="cell" dataKey="id"
                    @cell-edit-complete="onCellEditComplete">
                    <Column field="nom" header="Nom" :sortable="true"></Column>
                    <Column field="prenom" header="Prénom" :sortable="true"></Column>
                    <Column field="uid" header="UID" :sortable="true"></Column>
                    <!--editable column role-->
                    <Column field="role" header="Role" :sortable="true">
                        <template #body="slotProps">
                            <div>
                                {{ slotProps.data.role.role }}
                            </div>
                        </template>
                        <template #editor="{ data, field }">
                            <Dropdown v-model="data[field]" :options="roles" optionLabel="role"></Dropdown>
                        </template>
                    </Column>
                    <Column field="createdAt" header="Date de création" :sortable="true"></Column>
                </DataTable>
            </TabPanel>
            <TabPanel header="Exportation des données">
                <div class="flex justify-content-center flex-wrap card-container green-container">
                    <div class="grid justify-content-between">
                        <div class="col-6 justify-content-between">
                            <Button label="Exporter les données" class="p-button-raised p-button-rounded p-button-success"
                                icon="pi pi-download" iconPos="right" @click="exportToXLSX()"/>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>
        <!--Create a datatable with columns nom, prenom, uid, createdAt-->
    </div>
</template>