
<script setup>
import AssociationController from "../Controllers/AssociationController";
import CaracteristiquesController from "../Controllers/CaracteristiquesController";
import DataEquipementController from "../Controllers/DataEquipementController";
import ModeleEquipementController from "../Controllers/ModeleEquipementController";
import DocumentController from "../Controllers/DocumentController";

import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { onBeforeMount } from "@vue/runtime-core";

import Toast from "primevue/toast";

import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

import moment from 'moment'

const apiClient = useApiClient();
const authStore = useAuthStore()

const toast = useToast()

const equipementdetails = ref();
const selected_caracteristique = ref();

const input_caracteristiques_selected = ref([])

///////////////////////// GESTION DE LA NAVIGATION //////////////////////////
const route = useRoute()



const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})

const myItems = ref([])

watch(equipementdetails, async (newequipementdetails, oldequipementdetails) => {
  if (newequipementdetails != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Zones',
        to: '/Zones'
      },
      {
        label: newequipementdetails.salle.batiment.zone.libelle_long,
        to: '/Zones/' + newequipementdetails.salle.batiment.zone.id + '/Bat'
      },
      {
        label: newequipementdetails.salle.batiment.libelle_long,
        to: '/Zones/' + newequipementdetails.salle.batiment.zone.id + '/Bat/' + newequipementdetails.salle.batiment.id + '/Salles'
      },
      {
        label: newequipementdetails.salle.libelle,
        to: '/Zones/' + newequipementdetails.salle.batiment.zone.id + '/Bat/' + newequipementdetails.salle.batiment.id + '/Salles/' + newequipementdetails.salle.id + '/Equipements'
      },
      {
        label: newequipementdetails.modele_equipement.type_equipement.nom + ' ' + newequipementdetails.modele_equipement.marque + ' ' + newequipementdetails.modele_equipement.modele,
        to: '/Zones/' + newequipementdetails.salle.batiment.zone.id + '/Bat/' + newequipementdetails.salle.batiment.id + '/Salles/' + newequipementdetails.salle.id + '/Equipements/' + newequipementdetails.id
      },
    ]
  }
  return myItems.value
})

onMounted(async () => {
  if (!equipementdetails.value) {
    AssociationController.fetchAssociationById(apiClient, route.params.id_equipement).then(response => {
      equipementdetails.value = response.data.Association
    })
  }
})


let listeCaracteristiquesModifiables = ref(null);
onMounted(async () => {
  if (!listeCaracteristiquesModifiables.value) {
    CaracteristiquesController.fetchAllCaracteristiquesModifiable(apiClient).then(response => {
      listeCaracteristiquesModifiables.value = response.data.caracteristique_modifiable_list
    })
  }
})

let liste_modeles = ref(null);
onMounted(async () => {
  if (!liste_modeles.value) {
    ModeleEquipementController.fetchModeleEquipementByType(apiClient).then(response => {
      liste_modeles.value = response.data.modeles_list
    })
  }
})

let modeles_equipement = ref(null);
onMounted(async () => {
  if (!modeles_equipement.value) {
    ModeleEquipementController.fetchAllModeleEquipements(apiClient).then(response => {
      modeles_equipement.value = response.data.modeles_list
    })
  }
})

function createCaracteristiques() {
  for (let i = 0; i < input_caracteristiques_selected.value.length; i++) {
    DataEquipementController.createDataEquipement(apiClient, input_caracteristiques_selected.value[i].valeur, input_caracteristiques_selected.value[i].id, equipementdetails.value.id, route.params.id_salle).then(response => {
      if (response.data != null) {
        //fetch all equipements by id
        AssociationController.fetchAssociationById(apiClient, route.params.id_equipement).then(response => {
      equipementdetails.value = response.data.Association
    })
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Caractéristique ajoutée', life: 3000 });
      }
      else {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Caractéristique non ajoutée', life: 3000 });
      }
    })
  }
}

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;
  if (newValue !== data[field]) {
    DataEquipementController.editDataEquipement(apiClient, event.data.id, newValue).then(response => {
      if (response.data != null) {
        //fetch all equipements by id
        AssociationController.fetchAssociationById(apiClient, route.params.id_equipement).then(response => {
      equipementdetails.value = response.data.Association
    })
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Caractéristique modifiée', life: 3000 });
      }
    })
  }

}

function redirect(url) {
  window.location.href = url;
}

function splitFieldIntoArray(field) {
  let array = field.split(';')
  let array_final = []
  for (let i = 0; i < array.length; i++) {
    array_final.push({ valeur: array[i] })
  }
  return array_final
}

function deleteCaracteristiques(id_data_caracteristique) {
    DataEquipementController.deleteDataEquipementById(apiClient, id_data_caracteristique).then(response => {
    if (response.data.destroyed >= 1) {
        AssociationController.fetchAssociationById(apiClient, route.params.id_equipement).then(response => {
      equipementdetails.value = response.data.Association
    })
      displayDeleteDataEquipementDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique supprimée", life: 3000 });
    }
  })
}


function openDeleteDataEquipementDialog(data_caracteristique) {
  selected_caracteristique.value = data_caracteristique
  displayDeleteDataEquipementDialog.value = true
}


//fonctions pour afficher les formulaires

const displayDeleteDataEquipementDialog = ref(false)



const chargementDocuments = ref(true)


const uploadedFiles = ref([]);
const files = ref([]);
const totalSize = ref(0);
const totalSizePercent = ref(0);
const filesToDelete = ref([])
const delete_button_checked = ref(false);

const formatSize = (bytes) => {
  if (bytes === 0) {
    return '0 B';
  }
}

onBeforeMount(() => {
  DocumentController.findByAssociation(apiClient, route.params.id_equipement).then(response => {
    uploadedFiles.value = response.data.Documents
    uploadedFiles.value.forEach((file) => {
      if(file.type == "image"){
        file = new Image([file.hash], file.nom, {type: file.type})
      }
      else{
        file = new File([file.hash], file.nom, {type: file.type})
      }
      //for each file, we add the preview image to the object
      file.checked = false;
    })
    chargementDocuments.value = false;
  })
})

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
  });
}


async function preprocess(file) {
  let data = {
    name: file.name,
    hash: null,
    type_document: null,
  }
  data.type_document = "document"
    let hash = await fileToBase64(file)
    data.hash = hash
  return data
}

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
}


const onUpload = async () => {
  for (let i = 0; i < files.value.length; i++) {
    let data = await preprocess(files.value[i])
    DocumentController.insertDocument(apiClient, data.name, data.hash, data.type_document, null, null, route.params.id_equipement).then(response => {
      if (response.data != null) {
        uploadedFiles.value.push(response.data.Document)
        let file = uploadedFiles.value.find(file => file.id === response.data.Document.id) 
          file.hash = response.data.Document.hash;
        file.checked = false;
        files.value = [];
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Document ajouté', life: 3000 });
      }
      else {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Document non ajouté', life: 3000 });
      }
    })
  }
}

function generatePDF(file) {
  var link = document.createElement('a');
  link.download = file.nom;
  file.hash.replace('data:application/pdf;base64', 'data:application/octet-stream;base64');
  link.href = file.hash;
  link.click();
}

function deleteDocument() {
  uploadedFiles.value.forEach((image) => {
    if (image.checked) {
      filesToDelete.value.push(image)
    }
  })
  let i = 0
  filesToDelete.value.forEach((file_to_delete) => {
    i++;
    let file = uploadedFiles.value.find(file => file.hash === file_to_delete.hash)
    DocumentController.deleteDocument(apiClient, file.id).then(response => {
      if (response.data != null) {
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Document supprimé', life: 3000 });
      }
      else {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Document non supprimé', life: 3000 });
      }
    })
    uploadedFiles.value.splice(uploadedFiles.value.indexOf(file_to_delete), 1);
    delete_button_checked.value = false
    filesToDelete.value = []
  })
}



</script>



<template>
  <div>
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="equipementdetails"></BreadCrumbVue>
    <Toast />
    <div class="flex justify-content-between flex-wrap card-container" v-if="equipementdetails">
        <div class="flex flex-wrap">
      <span class="align-items-center text-2xl w-full" :class="{ 'text-400': equipementdetails.status }" v-if="equipementdetails"> <span class="mr-1" v-html="equipementdetails.modele_equipement.type_equipement?.icon"></span>
     {{ equipementdetails.modele_equipement.type_equipement.nom }} {{ equipementdetails.modele_equipement.marque }} {{ equipementdetails.modele_equipement.modele }}<span v-if="equipementdetails.libelle != null && equipementdetails.libelle != ''"> ({{ equipementdetails.libelle }})</span></span>
     <span class="flex align-items-center text-l w-full mt-2 text-600" v-if="equipementdetails"> <span v-if="equipementdetails.date_installation != null"><i class="fa-regular fa-calendar-check mr-1"></i>{{ moment(equipementdetails.date_installation).format('DD/MM/YYYY') }}</span><span v-if="equipementdetails.date_archivage != null && equipementdetails.status"><i class="fa-regular fa-calendar-xmark ml-2 mr-1"></i> {{ moment(equipementdetails.date_archivage).format('DD/MM/YYYY') }}</span></span>
    </div>
    <div class="flex">
        <Button label="Site administration" class="p-button-primary p-button-outlined p-button-sm p-button"
                icon="fa-solid fa-globe" target="_self" @click="redirect(equipementdetails.url_administration)"
                v-if="equipementdetails.url_administration != null">
              </Button>
            </div>
    </div>
    <TabView ref="tabview1">
      <TabPanel header="Caractéristiques de l'équipement">
        <DataTable v-if="equipementdetails" dataKey="id"  :value="equipementdetails.data_equipements" responsiveLayout="stack" breakpoint="960px" class="p-datatable"
              :paginator="true" :rows="10" editMode="cell" groupRowsBy="caracteristique.groupement" rowGroupMode="rowspan" sortField="caracteristique.groupement" :sortOrder="1"
              @cell-edit-complete="onCellEditComplete">
              <template #header>
                <div class="flex justify-content-between flex-wrap card-container">
                  <span class="flex align-items-center" v-if="equipementdetails">Liste des
                    caracteristiques</span>
                  <div class="flex">
                    <MultiSelect v-model="input_caracteristiques_selected"
                      placeholder="Ajouter des caractéristique existantes" class="p-button-outlined p-button-secondary"
                      :options="listeCaracteristiquesModifiables" optionLabel="grandeur"
                      style="width:18vw; margin-right:2vw" v-if="authStore.isAdmin">
                    </MultiSelect>
                    <Button label="Ajouter" class="p-button-success" @click="createCaracteristiques()"
                      v-if="input_caracteristiques_selected.length > 0 && authStore.isAdmin"></Button>
                  </div>
                </div>
              </template>
              <Column field="caracteristique.groupement" header="Groupement"></Column>
              <Column field="caracteristique.grandeur" header="Nom" :sortable="true"></Column>
              <Column field="valeur" header="Valeur" class="bg-blue-50">
        <template #body="slotProps">
          <div class="flex justify-content-between flex-wrap">
            <div class="flex align-items-center justify-content-center"> {{ slotProps.data?.valeur }}  </div>      
            <div class="flex align-items-center justify-content-center">  <i class="fa-solid fa-pencil"></i></div>
          </div>
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus placeholder="À remplir" v-if="data.caracteristique.valeur_default == null || data.caracteristique.valeur_default == ''">
          </InputText>
            <Dropdown v-model="data[field]" :options="splitFieldIntoArray(data.caracteristique.valeur_default)" optionLabel="valeur"
            optionValue="valeur" v-if="data.caracteristique.valeur_default != null && data.caracteristique.valeur_default != ''"></Dropdown>
        </template>
      </Column>
              <Column field="caracteristique.unite" header="Unité" :sortable="true"></Column>
              <Column header="Actions" v-if="authStore.isAdmin">
                <template #body="slotProps">
                  <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text"
                    @click="openDeleteDataEquipementDialog(slotProps.data.id)"
                    v-if="slotProps.data.caracteristique.modifiable == true && authStore.isAdmin" ></Button>
                </template>
              </Column>
            </DataTable>

      </TabPanel>
      <TabPanel header="Caractéristiques du modèle">
        <DataTable v-if="equipementdetails" :value="equipementdetails.modele_equipement.data_modeles" responsiveLayout="stack" breakpoint="960px" class="p-datatable"
              :paginator="true" :rows="10" groupRowsBy="caracteristique.groupement" rowGroupMode="rowspan"> 
              <template #header>
                <div class="flex justify-content-between flex-wrap card-container">
                  <span class="flex align-items-center" v-if="equipementdetails">Liste des
                    caracteristiques</span>
                  <div class="flex">
                    <router-link :to="({ name: 'CaracteristiquesModele', params: { id: equipementdetails.id_modele_equipement } })" class="pr-2"
                  style="text-decoration: none; color:#2c3e50">
                  <Button type="button" label="Voir la page du modèle" icon="fa-solid fa-circle-info"
                    class="p-button-primary p-button-outlined p-button-sm p-button" />
                </router-link>
                  </div>
                </div>
              </template>
              <Column field="caracteristique.groupement" header="Groupement"></Column>
              <Column field="caracteristique.grandeur" header="Nom" :sortable="true"></Column>
              <Column field="valeur" header="Valeur" :sortable="true">
              </Column>
              <Column field="caracteristique.unite" header="Unité" :sortable="true"></Column>
              <Column header="Actions" v-if="authStore.isAdmin">
                <template #body="slotProps">
                  <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text"
                    @click="openDeleteDataEquipementDialog(slotProps.data.id)"
                    v-if="slotProps.data.caracteristique.modifiable == true && authStore.isAdmin" ></Button>
                </template>
              </Column>
            </DataTable>
      </TabPanel>
      <div v-if="chargementDocuments" class="grid">
              <div v-bind:key="n"  v-for="n in 12" class="col-12 md:col-6 lg:col-3 xl:col-2">
                <Skeleton
                        :pt="{
                        root: { class: 'w-full h-15rem' }
                       }"
                />
              </div>
            </div>
            <TabPanel header="Documents">
        <div>
          <div class="flex justify-content-between flex-wrap mb-4">
            <span class="flex align-items-center" v-if="uploadedFiles">
              {{ uploadedFiles.filter((file) => file.type_document == 'document').length }} document(s)
            </span>
            <div class="flex">
              <Button label="Supprimer" v-if="delete_button_checked != false && (uploadedFiles.filter((file) => file.type_document == 'document')).length > 0"
                @click="deleteDocument" class="p-button p-button-danger ml-3" />

              <ToggleButton v-model="delete_button_checked" v-if="(uploadedFiles.filter((file) => file.type_document == 'document')).length == 0 && authStore.isOperateur"
                offLabel="Supprimer des documents" onLabel="Annuler" disabled class="p-button-outlined p-button-danger" />
              <ToggleButton v-model="delete_button_checked" v-else-if="authStore.isOperateur"
                offLabel="Supprimer des documents" onLabel="Annuler" class="p-button-outlined p-button-danger" />
            </div>
          </div>
          <ul class="list-none">
        <li v-bind:key="file" v-for="file in uploadedFiles.filter((file) => file.type_document == 'document')">
          <div v-if="file.type_document.includes('document')">
            <Checkbox class="mb-2" v-model="file.checked" :binary="true" v-if="delete_button_checked == true" />
            <Button icon="fa-solid fa-file-pdf" :pt="{ 
        icon: { class: 'text-red-600' } 
    }" :label="file.nom" @click="generatePDF(file)" link />
          </div>
        </li>
      </ul>
      </div>
        <FileUpload :showUploadButton="false" :showCancelButton="false" :auto="true" name="demo2[]" :customUpload="true" @uploader="onUpload" :multiple="true" :maxFileSize="1000000" @select="onSelectedFiles">
          <template #empty>
            <div class="flex align-items-center justify-content-center flex-column">
                <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                <p class="mt-4 mb-0">Faites glisser et déposez les fichiers <b>ici</b> pour les télécharger.</p>
              </div>
          </template>
        </FileUpload>
      </TabPanel>
    </TabView>
    <Dialog header="Supprimer une caractéristique" v-model:visible="displayDeleteDataEquipementDialog" :modal="true" :closable="false"
      :dismissableMask="true" :responsive="true" :showHeader="true" :style="{ width: '50vw' }">
      <p>Êtes-vous sûr de vouloir supprimer cette caractéristique ?</p>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text p-button-primary"
          @click="displayDeleteDataEquipementDialog = false" />
          <Button label="Supprimer" icon="pi pi-check" class="p-button-primary"
          @click="deleteCaracteristiques(selected_caracteristique)" />
      </template>
    </Dialog>
  </div>



  

</template>


<style scoped></style>