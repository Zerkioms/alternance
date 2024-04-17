<script setup>

import LogsController from "../Controllers/LogsController.js";
import { ref } from "@vue/reactivity";
import BreadCrumbVue from "../components/BreadCrumbVue.vue";
import { onMounted } from "@vue/runtime-core";

import { FilterMatchMode } from 'primevue/api';
import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import moment from 'moment';

const apiClient = useApiClient();

const logs = ref('----------');
const loading = ref(true);
onMounted(async () => {
    LogsController.fetchAllLogs(apiClient).then(response => {
      logs.value = response.data.logs
      var myArray = {"POST": "Ajouter", "PUT": "Modifier", "DELETE": "Suprimer"};
      for (let i = 0; i < logs.value.length; i++) {
                let temp = new Object();
                temp.typeactionlit = myArray[logs.value[i].method]
                temp.latable = logs.value[i].url.split('/')[2]
                if (logs.value[i].url.split('/').length == 4) {
                  temp.idressource = logs.value[i].url.split('/')[3]
                }else{
                temp.idressource = '-'
              }
                Object.assign(logs.value[i], temp)
            }
            loading.value = false;
    })
})
const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})
const myItems = ref([])
myItems.value = [
      {
        label: 'Logs',
        to: '/Logs'
      },
    ]


    const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

</script>

<template>
    <div>
        <BreadCrumbVue :items="myItems" :home="myHome"></BreadCrumbVue>
        <DataTable :value="logs" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm"
        :paginator="true" :rows="10" v-model:filters="filters" dataKey="id" filterDisplay="row"
                :globalFilterFields="['createdAt', 'typeactionlit', 'latable', 'uid', 'body']">
        <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="logs">Liste des logs</span>
         
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Rechercher dans les logs" />
                    </span>
                </div>
              </div>
            </template>
            <template #empty> <div class="text-center m-4">Aucun log trouvé.</div></template>
        <Column field="createdAt" header="Date et heure" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
              {{ moment(slotProps.data.createdAt).format('DD/MM/YYYY HH:mm:ss') }}
            </template>
        </Column>
        <Column field="typeactionlit" header="Type action" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
              {{ slotProps.data.typeactionlit }}
            </template>
        </Column>
        <Column field="latable" header="Où" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
              {{ slotProps.data.latable }}
            </template>        
        </Column>
        <Column field="body" header="Quoi" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
            <div v-bind:key="value" v-for="(value, key) in JSON.parse(slotProps.data.body)">
              <p v-if="key != 'hash'">{{ key }} : {{ value }}</p>
            </div> 
            </template>
        </Column>
        <Column field="idressource" header="Id Ressource" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
              {{ slotProps.data.idressource }}
            </template> 
        </Column>
        <Column field="uid" header="Qui" :sortable="true">
          <template #body v-if="loading">
            <Skeleton></Skeleton>
        </template>
          <template #body="slotProps" v-else>
              {{ slotProps.data.uid }}
            </template> 
        </Column>
      </DataTable>
    </div>
</template>