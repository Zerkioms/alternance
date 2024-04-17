<script setup>
import RechercheController from "../Controllers/RechercheController.js";
import ZoneController from "../Controllers/ZoneController.js";
import SalleController from "../Controllers/SalleController.js";
import BatimentController from "../Controllers/BatimentController.js";

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from "@vue/runtime-core";

import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

import { FilterMatchMode } from 'primevue/api';

const apiClient = useApiClient();
const authStore = useAuthStore()

const loading2 = ref(true);
const route = useRoute()
const touterecherche  = ref([])
const touterecherche2 = ref(null);
const selectedLine = ref();
const filters = ref({
    global: { value: route.query.q, matchMode: FilterMatchMode.CONTAINS }
});


const zones = ref(null);
const recherche = ref(null);
const batiments = ref(null);
const salles = ref(null);

onMounted(async () => {
    ZoneController.fetchAllZones(apiClient).then(response => {
      zones.value = response.data.zone_list
      zones.value.forEach((zone) => {
      let rechzone = {
        type: 'zone',
        affichage: 'Zone',
        classement: 1,
        icone: '<i class="fa-solid fa-location-dot"></i>',
        donnees: zone
      }
      touterecherche.value.push(rechzone);
    })
    })
    .then (() => {
        BatimentController.fetchAllBatiments(apiClient).then(response => {
      batiments.value = response.data.batiment_list
      batiments.value.forEach((batiment) => {
      let rechbat = {
        type: 'batiment',
        affichage: 'Bâtiment',
        classement: 2,
        icone:'<i class="fa fa-building"></i>',
        donnees: batiment
      }
      touterecherche.value.push(rechbat);
    })
    }) 
    .then (() => {
        SalleController.fetchAllSalles(apiClient).then(response => {
      salles.value = response.data.salle_list
      salles.value.forEach((salle) => {
      let rechsalle = {
        type: 'salle',
        affichage: 'Salle',
        classement: 3,
        icone:'<i class="fa-solid fa-chair"></i>',
        donnees: salle
      }
      touterecherche.value.push(rechsalle);
    })
    })
    .then (() => {
        RechercheController.fetchAllRecherche(apiClient).then(response => {
            recherche.value = response.data.recherche_list
            for (let i = 0; i < recherche.value.length; i++) {
                let temp = new Object();
                let lignedata = ''
                let lignedata2 = ''
                for (let j = 0; j < recherche.value[i].data_equipements.length; j++) {
                    lignedata = lignedata + recherche.value[i].data_equipements[j].caracteristique.grandeur + ' : ' + recherche.value[i].data_equipements[j].valeur + ' / '
                }
                for (let k = 0; k < recherche.value[i].modele_equipement.data_modeles.length; k++) {
                    lignedata2 = lignedata2 + recherche.value[i].modele_equipement.data_modeles[k].caracteristique.grandeur + ' : ' + recherche.value[i].modele_equipement.data_modeles[k].valeur + ' / '
                }
                temp.dateq = lignedata
                temp.modeleeq = lignedata2
                temp.dialog = false
                Object.assign(recherche.value[i], temp)
            }
            recherche.value.forEach((recherche) => {
      let recheq = {
        type: 'equipement',
        affichage: 'Equipement',
        classement: 4,
        icone:'<i class="fa-solid fa-bars-progress"></i>',
        donnees: recherche
      }
      touterecherche.value.push(recheq);
  })
        })
        .then (() => {  
            loading2.value = false;   
        })
    })   
    })        
})
})



watch(selectedLine, async (newselectedLine, oldtselectedLine) => {
    if (newselectedLine.type=='equipement') {
        let lien = '/Zones/'+ newselectedLine.donnees.salle.batiment.id_zone + '/Bat/'+ newselectedLine.donnees.salle.id_batiment + '/Salles/' + newselectedLine.donnees.id_salle + '/Equipements/' + newselectedLine.donnees.id
        redirect(lien) 
    }
    if (newselectedLine.type=='salle') {
        let lien = '/Zones/'+ newselectedLine.donnees.batiment.id_zone + '/Bat/'+ newselectedLine.donnees.id_batiment + '/Salles/' + newselectedLine.donnees.id + '/Equipements'
        redirect(lien) 
    }
    if (newselectedLine.type=='batiment') {
        let lien = '/Zones/'+ newselectedLine.donnees.id_zone + '/Bat/'+ newselectedLine.donnees.id + '/Salles'
        redirect(lien) 
    }
    if (newselectedLine.type=='zone') {
        let lien = '/Zones/'+ newselectedLine.donnees.id + '/Bat'
        redirect(lien) 
    }     
})



watch(touterecherche.value, async (newtouterecherche, oldtouterecherche) => {
  if (touterecherche.value != null) {
    if (route.query.r == null || route.query.r =='') {
    touterecherche2.value = newtouterecherche
}else{
if (route.query.r == 'z') {
    console.log("ddddddd")
    touterecherche2.value = newtouterecherche.filter((item) => item.type == 'zone')
}
if (route.query.r == 'b') {
    touterecherche2.value = newtouterecherche.filter((item) => item.type == 'batiment')
}
if (route.query.r == 's') {
    touterecherche2.value = newtouterecherche.filter((item) => item.type == 'salle')
}
if (route.query.r == 'e') {
    touterecherche2.value = newtouterecherche.filter((item) => item.type == 'equipement')
}
}
  loading2.value = false;
  }
})




const myHome = ref({
    icon: 'fa-solid fa-home',
    to: '/'
})
const myItems = ref([])
myItems.value = [
    {
        label: 'Recherche',
        to: 'Recherche'
    },
]

function redirect(url) {
    window.location.href = url;
}
</script>

<template>
    <div>
        <BreadCrumbVue :items="myItems" :home="myHome"></BreadCrumbVue>
        <DataTable v-model:filters="filters" :value="touterecherche2" v-model:selection="selectedLine" selectionMode="single" responsiveLayout="stack" breakpoint="960px"
            class="p-datatable" rowGroupMode="subheader" groupRowsBy="type" sortField="classement" :sortOrder="1" scrollable scrollHeight="500px" 
            :globalFilterFields="['donnees.libelle_long', 'donnees.libelle_court', 'donnees.libelle',
            'donnees.zone.libelle_long', 'donnees.zone.libelle_court',
            'donnees.modele_equipement.type_equipement.nom', 'donnees.modele_equipement.marque', 'donnees.modele_equipement.modele',
            'donnees.salle.batiment.zone.libelle_long', 'donnees.salle.batiment.zone.libelle_court', 
            'donnees.salle.batiment.libelle_long', 'donnees.salle.batiment.libelle_court', 
            'donnees.salle.libelle', 'donnees.dateq', 'donnees.modeleeq', 'donnees.libelle'
            ]">
            <template #header>
                <div class="flex justify-content-center flex-wrap">
                <InputText v-model="filters['global'].value" placeholder="Rechercher" class="w-full"/>

                </div>
            </template>
            <template #empty> Aucun résultat. </template>
            <template #loading> Chargement des équipements, merci de patienter... </template>
            <Column field="type" header="Code" :sortable="true"></Column>
            <Column>
                <template #body v-if="loading2">
            <Skeleton></Skeleton>
        </template>
                <template #body="{ data }" v-else>
                    <span class="ml-4" v-if="data.type == 'zone'">{{ data.donnees.libelle_long }} <Tag class="ml-2 bg-blue-100 text-500" :value="data.donnees.libelle_court"></Tag></span>
                    <span class="ml-4" v-if="data.type == 'batiment'">{{ data.donnees.libelle_long }} <Tag class="ml-2 bg-blue-100 text-500" :value="data.donnees.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.zone.libelle_court"></Tag></span>
                    <span class="ml-4" v-if="data.type == 'salle'">{{ data.donnees.libelle }} <Tag icon="fa-solid fa-stairs" class="ml-2 bg-blue-100 text-500" :value="data.donnees.etage"></Tag><Tag icon="fa fa-building" class="ml-2 surface-ground text-500" :value="data.donnees.batiment.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.batiment.zone.libelle_court"></Tag> </span>
                    <span class="ml-4" v-if="data.type == 'equipement'">{{ data.donnees.modele_equipement.marque }} {{ data.donnees.modele_equipement.modele }} <span v-if="data.donnees.libelle != null && data.donnees.libelle != ''"> ({{ data.donnees.libelle }})</span><Tag v-html="data.donnees.modele_equipement.type_equipement?.icon + ' ' + data.donnees.modele_equipement.type_equipement.nom" class="ml-2 bg-blue-100 text-500"></Tag><Tag icon="fa-solid fa-chair" class="ml-2 surface-ground text-500" :value="data.donnees.salle.libelle"></Tag><Tag icon="fa fa-building" class="ml-2 surface-ground text-500" :value="data.donnees.salle.batiment.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.salle.batiment.zone.libelle_court"></Tag><Tag v-if="data.donnees.status"  class="ml-2 bg-blue-100 text-500"><i class="fa-solid fa-eye-slash"></i></Tag><Tag v-else  class="ml-2 bg-blue-100 text-500"><i class="fa-solid fa-eye"></i></Tag></span>
                </template>
            </Column>
            <template #groupheader="slotProps">
                <div class="flex align-items-center gap-2 text-lg">
                <span class="text-2xl" v-html="slotProps.data?.icone"></span><span> {{ slotProps.data.affichage }}</span>
            </div>
            </template>
        </DataTable>


        <!--
        <DataTable v-model:filters="filters" :value="recherche" stripedRows responsiveLayout="stack" breakpoint="960px"
            class="p-datatable" :paginator="true" :rows="10" filterDisplay="row" :loading="loading"
            :globalFilterFields="['salle.batiment.zone.libelle_long', 'salle.batiment.libelle_long', 'salle.libelle', 'modele_equipement.marque', 'modele_equipement.modele', 'dateq', 'modeleeq']">
            <template #header>
                <div class="flex justify-content-between flex-wrap card-container">
                    <span class="flex align-items-center" v-if="recherche">Recherche</span>
                    <div class="flex">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </span>
                    </div>
                </div>
            </template>
            <template #empty> Aucun équipement trouvé. </template>
            <template #loading> Chargement des équipements, merci de patienter... </template>
            <Column filterField="salle.batiment.zone.libelle_long" header="Zone">
                <template #body="{ data }">
                    {{ data.salle.batiment.zone.libelle_long }}
                </template>
            </Column>
            <Column filterField="salle.batiment.libelle_long" header="Batiment">
                <template #body="{ data }">
                    {{ data.salle.batiment.libelle_long }}
                </template>
            </Column>
            <Column filterField="salle.libelle" header="Salle">
                <template #body="{ data }">
                    <router-link
                    class="text-700 hover:text-800 no-underline" :to="({ path: 'Zones/' + data.salle.batiment.id_zone + '/Bat/' + data.salle.id_batiment + '/Salles/' + data.salle.id + '/Equipements' })">
                       {{ data.salle.libelle }}
                    </router-link>

                </template>
            </Column>
            <Column filterField="modele_equipement.modele" header="Equipement">
                <template #body="{ data }">
                    <span class="cursor-pointer" @click="data.dialog = true">{{ data.modele_equipement.modele }}</span>
                    <Dialog v-model:visible="data.dialog" header="Caractéristiques" :style="{ width: '50vw' }">
                        <ul>
                            <li v-for="item in data.data_equipements">
                                {{ item.caracteristique.grandeur }} : {{ item.valeur }} {{ item.caracteristique.unite }}
                            </li>
                        </ul>
                        <ul>
                            <li v-for="item in data.modele_equipement.data_modeles">
                                {{ item.caracteristique.grandeur }} : {{ item.valeur }} {{ item.caracteristique.unite }}
                            </li>
                        </ul>
                    </Dialog>
                </template>
            </Column>
            <Column filterField="modele_equipement.marque" header="Marque">
                <template #body="{ data }">
                    {{ data.modele_equipement.marque }}
                </template>
            </Column>
            <Column filterField="modele_equipement.type_equipement.nom" header="Type équipement">
                <template #body="{ data }">
                    <span v-html="data.modele_equipement.type_equipement?.icon"></span>
                    {{ data.modele_equipement.type_equipement.nom }}
                </template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <Button label="Site administration" class="p-button-primary p-button-outlined p-button-sm p-button"
                        icon="fa-solid fa-globe" target="_self" @click="redirect(data.url_administration)"
                        v-if="data.url_administration != null">
                    </Button>
                </template>
            </Column>
        </DataTable>




        <DataTable v-model:filters="filters2" :value="zones" stripedRows responsiveLayout="stack" breakpoint="960px"
            class="p-datatable" :paginator="true" :rows="10" filterDisplay="row" :loading="loading2"
            :globalFilterFields="['libelle_long', 'libelle_court']">
            <template #header>
                <div class="flex justify-content-between flex-wrap card-container">
                    <span class="flex align-items-center" v-if="zones">Recherche</span>
                    <div class="flex">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters2['global'].value" placeholder="Keyword Search" />
                        </span>
                    </div>
                </div>
            </template>
            <template #empty> Aucune zone trouvée. </template>
            <template #loading> Chargement des équipements, merci de patienter... </template>
            <Column filterField="libelle_long" header="Zone">
                <template #body="{ data }">
                    {{ data.libelle_long }}
                </template>
            </Column>
        </DataTable>
        -->
    </div>
</template>