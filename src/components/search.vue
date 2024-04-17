<script setup>

import RechercheController from "../Controllers/RechercheController.js";
import ZoneController from "../Controllers/ZoneController.js";
import SalleController from "../Controllers/SalleController.js";
import BatimentController from "../Controllers/BatimentController.js";
import {useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { ref, watch } from 'vue'

import { FilterMatchMode } from 'primevue/api';

const apiClient = useApiClient();

const loading2 = ref(true);
const touterecherche  = ref([])
const touterecherche2 = ref(null);
const selectedLine = ref();



const lazone = ref(null);
const recherche = ref(null);
const batiments = ref(null);
const salles = ref(null);


function InitRecherche() {
    ZoneController.fetchAllZones(apiClient).then(response => {
      lazone.value = response.data.zone_list
      lazone.value.forEach((zone) => {
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
}


function redirect(url) {
    window.location.href = url;
}

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

const filters = ref({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS }
});
const op = ref();

const show = (event) => {
    op.value.show(event);
};


</script>
<template>
    <InputText v-model="filters['global'].value" placeholder="Rechercher" aria-haspopup="true" aria-controls="overlay_panel" @click="show" @focus="InitRecherche()"/>
    <OverlayPanel ref="op" appendTo="body" class="scalein animation-duration-100">   
    <DataTable v-model:filters="filters" :value="touterecherche" v-model:selection="selectedLine" selectionMode="single" responsiveLayout="stack" breakpoint="960px"
            class="p-datatable w-30rem" rowGroupMode="subheader" groupRowsBy="type" sortField="classement" :sortOrder="1" scrollable scrollHeight="500px" 
            :globalFilterFields="['donnees.libelle_long', 'donnees.libelle_court', 'donnees.libelle',
            'donnees.zone.libelle_long', 'donnees.zone.libelle_court',
            'donnees.modele_equipement.type_equipement.nom', 'donnees.modele_equipement.marque', 'donnees.modele_equipement.modele',
            'donnees.salle.batiment.zone.libelle_long', 'donnees.salle.batiment.zone.libelle_court', 
            'donnees.salle.batiment.libelle_long', 'donnees.salle.batiment.libelle_court', 
            'donnees.salle.libelle', 'donnees.dateq', 'donnees.modeleeq', 'donnees.libelle'
            ]">
            <template #empty><div class="w-24rem">Aucun résultat. </div></template>
            <template #loading> Chargement des équipements, merci de patienter... </template>
            <Column field="type" header="Code" :sortable="true"></Column>
            <Column>
              <template #body v-if="loading2">
                <div class="w-30rem"><Skeleton></Skeleton></div>
        </template>
                <template #body="{ data }" v-else>
                    <span class="ml-4" v-if="data.type == 'zone'">{{ data.donnees.libelle_long }} <Tag class="ml-2 bg-blue-100 text-500" :value="data.donnees.libelle_court"></Tag></span>
                    <span class="ml-4" v-if="data.type == 'batiment'">{{ data.donnees.libelle_long }} <Tag class="ml-2 bg-blue-100 text-500" :value="data.donnees.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.zone.libelle_court"></Tag></span>
                    <span class="ml-4" v-if="data.type == 'salle'">{{ data.donnees.libelle }} <Tag icon="fa-solid fa-stairs" class="ml-2 bg-blue-100 text-500" :value="data.donnees.etage"></Tag><Tag icon="fa fa-building" class="ml-2 surface-ground text-500" :value="data.donnees.batiment.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.batiment.zone.libelle_court"></Tag> </span>
                    <span class="ml-4" v-if="data.type == 'equipement'">{{ data.donnees.modele_equipement.marque }} {{ data.donnees.modele_equipement.modele }} <span v-if="data.donnees.libelle != null && data.donnees.libelle != ''"> ({{ data.donnees.libelle }})</span><Tag :v-html="data.donnees.modele_equipement.type_equipement?.icon + ' ' + data.donnees.modele_equipement.type_equipement.nom" class="ml-2 bg-blue-100 text-500"></Tag><Tag icon="fa-solid fa-chair" class="ml-2 surface-ground text-500" :value="data.donnees.salle.libelle"></Tag><Tag icon="fa fa-building" class="ml-2 surface-ground text-500" :value="data.donnees.salle.batiment.libelle_court"></Tag><Tag icon="fa-solid fa-location-dot" class="ml-2 surface-ground text-500" :value="data.donnees.salle.batiment.zone.libelle_court"></Tag><Tag v-if="data.donnees.status"  class="ml-2 bg-blue-100 text-500"><i class="fa-solid fa-eye-slash"></i></Tag><Tag v-else  class="ml-2 bg-blue-100 text-500"><i class="fa-solid fa-eye"></i></Tag></span>
                </template>
            </Column>
            <template #groupheader="slotProps">
                <div class="flex align-items-center gap-2 text-lg">
                <span class="text-2xl" v-html="slotProps.data?.icone"></span><span> {{ slotProps.data.affichage }}</span>
            </div>
            </template>
        </DataTable>
</OverlayPanel>
</template>