 
<script setup>
import DataModeleController from "../Controllers/DataModeleController";
import CaracteristiquesController from "../Controllers/CaracteristiquesController";
import AssociationController from "../Controllers/AssociationController";
import SalleController from "../Controllers/SalleController.js";
import DataEquipementController from "../Controllers/DataEquipementController";
import DocumentController from "../Controllers/DocumentController";


import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { onMounted } from "@vue/runtime-core";
import { useToast } from "primevue/usetoast";
import { onBeforeMount } from "@vue/runtime-core";


import Toast from "primevue/toast";

import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

const apiClient = useApiClient();
const authStore = useAuthStore()

const route = useRoute()
const toast = useToast()

const input_caracteristiques_selected = ref([])
const selected_caracteristique = ref()
const modele = ref()
const modele_salle = ref()

const input_status = ref(false);
const input_date_installation = ref();
const input_date = ref();
const input_url_administration = ref();
const input_libelle = ref();
const input_salle = ref();
const input_caracteristiques = ref();

const dataTableSalleRef = ref(null);

onMounted(async () => {
  if (!modele.value) {
    try {
      DataModeleController.fetchCaracteristiquesModele(apiClient, route.params.id).then(response => {
        modele.value = response.data.modele
      })
    } catch (error) {
      console.log(error)
    }
  }
})


watch(modele, async (newmodele, oldmodele) => {
  if (newmodele != null) {
    try {
      AssociationController.fetchSalleByEquipement(apiClient, newmodele.id).then(response => {
        modele_salle.value = response.data.salles_list
      })
    } catch (error) {
      console.log(error)
    }
  }
  
})


const caracteristiques_non_modifiable = ref()
onMounted(async () => {
  if (!caracteristiques_non_modifiable.value) {
    CaracteristiquesController.fetchAllCaracteristiquesNonModifiable(apiClient).then(response => {
      caracteristiques_non_modifiable.value = response.data.caracteristique_non_modifiable_list
    })

  }
})

const list_des_salles = ref()
onMounted(async () => {
  if (!list_des_salles.value) {
    SalleController.fetchAllSalles(apiClient).then(response => {
      list_des_salles.value = response.data.salle_list
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

function createCaracteristiques() {
  for (let i = 0; i < input_caracteristiques_selected.value.length; i++) {
    DataModeleController.createDataModele(apiClient, input_caracteristiques_selected.value[i].id, route.params.id).then(response => {
      if (response.data.created_data_modele) {
        DataModeleController.fetchCaracteristiquesModele(apiClient, route.params.id).then(response => {
          modele.value = response.data.modele
        })
      }
    })
  }
  toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique ajoutée", life: 3000 });

}

function deleteCaracteristiques(id_data_caracteristique) {
  DataModeleController.deleteCaracteristique(apiClient, id_data_caracteristique).then(response => {
    if (response.data.destroyed >= 1) {
      DataModeleController.fetchCaracteristiquesModele(apiClient, route.params.id).then(response => {
        modele.value = response.data.modele
      })
      displayDeleteDialog.value = false
      toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique supprimée", life: 3000 });
    }
  })
}

const displayDeleteDialog = ref(false)
function openDeleteDialog(data_caracteristique) {
  selected_caracteristique.value = data_caracteristique
  displayDeleteDialog.value = true
}

function splitFieldIntoArray(field) {
  let array = field.split(';')
  let array_final = []
  for (let i = 0; i < array.length; i++) {
    array_final.push({ valeur: array[i] })
  }
  return array_final
}

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;
  if (newValue !== data[field]) {
    DataModeleController.updateDataModele(apiClient, data.id, newValue).then(response => {
      if (response.data.updated == 1) {
        DataModeleController.fetchCaracteristiquesModele(apiClient, route.params.id).then(response => {
          modele.value = response.data.modele
          toast.add({ severity: 'success', summary: 'Succès', detail: "Caracteristique modifiée", life: 3000 });
        })
      }
    })
  }
};

function createEquipement() {
  AssociationController.createAssociation(apiClient, input_salle.value.id, route.params.id, input_status.value, input_date.value, input_url_administration.value, input_libelle.value, input_date_installation.value).then(response => {
    if (response.data != null) {
      if (input_caracteristiques.value != null) {
      //for each input_caracteristiques.value, we create a data_equipement
      for (let i = 0; i < input_caracteristiques.value.length; i++) {
        DataEquipementController.createDataEquipement(apiClient, input_caracteristiques.value[i].valeur, input_caracteristiques.value[i].id, response.data.Association.id, route.params.id_salle).then(response => {
        })
      }
    }
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Equipement créé', life: 3000 });
      DataModeleController.fetchCaracteristiquesModele(apiClient, route.params.id).then(response => {
        modele.value = response.data.modele
      })
      displayCreateDialog.value = false
    }
    else {
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Equipement non créé', life: 3000 });
      displayCreateDialog.value = false
    }
  })
}

const displayCreateDialog = ref(false)


function openCreateDialog() {
  displayCreateDialog.value = true
}


const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})


const myItems = ref([])

watch(modele, async (newModele, oldZone) => {
  if(newModele != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Modeles d\'équipements',
        to: '/Modeles_Equipement'
      },
      {
        label: newModele.modele,
        to: '/Modeles_Equipement/' + newModele.id + '/Caracteristiques'
      },
    ]
  }
  return myItems.value
})



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
  DocumentController.findByModele(apiClient, route.params.id).then(response => {
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
    DocumentController.insertDocument(apiClient, data.name, data.hash, data.type_document, null, route.params.id, null).then(response => {
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
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="modele"></BreadCrumbVue>
    <Toast />
    <div class="flex align-content-around flex-column card-container">
      <span class="flex align-items-center text-2xl w-13rem" v-if="modele"> <i class="fa-solid fa-book"
          style="margin-right:1rem"></i>{{ modele.modele }}</span>
    </div>
    <TabView ref="tabview1">
      <TabPanel header="Caractéristiques du modèle">
    <DataTable :value="modele.data_modeles" editMode="cell" dataKey="id" stripedRows responsiveLayout="stack" breakpoint="960px"
      :paginator="true" :rows="10" v-if="modele" @cell-edit-complete="onCellEditComplete">
      <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="modele">Liste des caractéristiques</span>
            <div class="flex">
              <MultiSelect v-model="input_caracteristiques_selected" placeholder="Ajouter des caractéristiques"
          class="p-button-outlined p-button-secondary" :options="caracteristiques_non_modifiable" optionLabel="grandeur"
          style="width:25vw; margin-right:2vw"></MultiSelect>
          <Button label="Ajouter" class="p-button-success" @click="createCaracteristiques"
          v-if="input_caracteristiques_selected.length != 0"></Button>

            </div>
          </div>
        </template>
      <Column field="grandeur" header="Grandeur" style="width:20%">
        <template #body="slotProps">
          {{ slotProps.data.caracteristique?.grandeur }}
        </template>
      </Column>
      <Column field="unite" header="Unité de mesure" style="width:20%">
        <template #body="slotProps">
          {{ slotProps.data.caracteristique?.unite }}
        </template>

      </Column>
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
      <Column field="type_valeur" header="Type de valeur">
        <template #body="slotProps">
          {{ slotProps.data.caracteristique?.type_valeur }}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text"
            @click="openDeleteDialog(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </TabPanel>
  <TabPanel header="Salles avec le modèle">

    <DataTable :ref="dataTableSalleRef" :value="modele_salle" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm" :paginator="true" :rows="10" v-if="modele_salle">
        <template #header>
          <div class="flex justify-content-between flex-wrap card-container">
            <span class="flex align-items-center" v-if="modele_salle">Liste des salles</span>
            <div class="flex">
              <Button label="Ajouter une salle" class="p-button-success w-13rem" icon="pi pi-plus" @click="openCreateDialog" v-if="authStore.isAdmin"></Button>
            </div>
          </div>
        </template>
        <template #empty> <div class="text-center m-4">Aucune salle.</div></template>
        <Column field="salle.libelle" header="Salle" :sortable="true"></Column>
        <Column field="salle.batiment.libelle_long" header="Batiment" :sortable="true"></Column>
        <Column field="salle.batiment.zone.libelle_long" header="Zone" :sortable="true"></Column>
        <Column field="libelle" header="Libellé de l'équipement" :sortable="true"></Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-wrap flex-row">
              <div class="flex align-items-center justify-content-center">
                <router-link :to="({ name: 'EquipementDetails', params: { id_equipement: slotProps.data.id, id_zone: slotProps.data.salle.batiment.zone.id, id_batiment: slotProps.data.salle.batiment.id, id_salle: slotProps.data.salle.id } })" class="pr-2"
                  style="text-decoration: none; color:#2c3e50">
                  <Button type="button" label="Détails équipement" icon="fa-solid fa-circle-info"
                    class="p-button-primary p-button-outlined p-button-sm p-button" />
                </router-link>
              </div>
            </div>
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
    <Dialog header="Supprimer une caractéristique" v-model:visible="displayDeleteDialog" :modal="true" :closable="false"
      :dismissableMask="true" :responsive="true" :showHeader="true" :style="{ width: '50vw' }">
      <p>Êtes-vous sûr de vouloir supprimer cette caractéristique ?</p>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text p-button-primary"
          @click="displayDeleteDialog = false" />
          <Button label="Supprimer" icon="pi pi-check" class="p-button-primary"
          @click="deleteCaracteristiques(selected_caracteristique.id)" />
      </template>
    </Dialog>

    <Dialog header="Ajouter ce modèle à une salle" v-model:visible="displayCreateDialog" :modal="true" :closable="true"
    :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '45vw' }">
    <div class="fluid formgrid grid">
      <div class="field col-12 ">
        <Dropdown v-model="input_salle" :options="list_des_salles" filter :filterFields="libelle" optionLabel="libelle" placeholder="Sélectionner la salle" class="w-full" :class="{ 'p-invalid': input_salle == null || input_salle == '' }">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.libelle }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center">
                  <div class="col-4"><i class="fa-solid fa-chair"></i><span class="ml-1">{{ slotProps.option.libelle }}</span></div>
                    <div class="col-4"><i class="fa fa-building"></i><span class="ml-1">{{ slotProps.option.batiment.libelle_court }}</span></div>
                    <div class="col-4"><i class="fa-solid fa-location-dot"></i><span class="ml-1">{{ slotProps.option.batiment.zone.libelle_court}}</span></div>
                </div>
            </template>
        </Dropdown>

      </div>
      <div class="col-12 field">
        <InputText v-model="input_libelle" placeholder="Libellé" class="w-full" />
      </div>
    </div>
    <div class="fluid formgrid grid">
      <!--InputSwitch on status column-->
      <div class="col-6 field">
        <InputText v-model="input_url_administration" placeholder="URL d'administration" class="w-full" />
      </div>
      <div class="col-6 field">
        <Calendar inputId="icon" class="w-full" v-model="input_date_installation" :showIcon="true" showButtonBar />
      </div>
      <div class="field col-6">
        <ToggleButton v-model="input_status" onLabel="Archivé" offLabel="Présent" class="w-full" />
      </div>
      <!--Calendar-->
      <div class="col-6">
        <Calendar inputId="icon" class="w-full" v-model="input_date" :showIcon="true" v-if="input_status == true" showButtonBar />
        <Calendar inputId="icon" disabled="disabled" class="w-full" :showIcon="true" v-if="input_status == false" showButtonBar />
      </div>
    </div>
    <div class="fluid formgrid grid">

    <div class="field col-12 ">
        <MultiSelect v-model="input_caracteristiques" :options="listeCaracteristiquesModifiables" optionLabel="grandeur"
          placeholder="Liste des caractéristiques" class="w-full" />
      </div>
      <!--for each input_caracteristiques create a different inputtext with a placeholder named after the caracteristique-->
      <div class="field col-12" v-for="caracteristique in input_caracteristiques" :key="caracteristique.id">
        <Dropdown :options="caracteristique.valeur_default.split(';')" v-model="caracteristique.valeur" :placeholder="'Valeur ' + caracteristique.grandeur" class="w-full" v-if="caracteristique.valeur_default != null && caracteristique.valeur_default != ''" />
        <InputText v-model="caracteristique.valeur" :placeholder="'Valeur ' + caracteristique.grandeur" class="w-full" v-else/>
      </div>
    </div>

    <template #footer>
      <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class=" p-button-text" @click="displayCreateDialog = false" />
          <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
                v-if="input_salle == null || input_salle == ''"
                autofocus />
              <Button label="Ajouter" icon="pi pi-check" @click="createEquipement" v-else autofocus />
        </div>
      </div>
    </template>
  </Dialog>




</div>
</template>


<style scoped>
</style>