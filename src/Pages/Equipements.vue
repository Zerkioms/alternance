
<script setup>
import AssociationController from "../Controllers/AssociationController";
import CaracteristiquesController from "../Controllers/CaracteristiquesController";
import DataEquipementController from "../Controllers/DataEquipementController";
import ModeleEquipementController from "../Controllers/ModeleEquipementController";
import DocumentController from "../Controllers/DocumentController";
import UsageController from "../Controllers/UsageController"
import TypeUsageController from "../Controllers/TypeUsageController"

import { ref, watch } from 'vue'
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { useRoute } from 'vue-router'
import { computed } from "@vue/runtime-core";
import { useToast } from 'primevue/usetoast';

import Toast from "primevue/toast";
import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { useAuthStore } from "../stores/authStore.js";

import moment from 'moment'
import TypeEquipementController from "../Controllers/TypeEquipementController";


const apiClient = useApiClient();
const authStore = useAuthStore()

const toast = useToast()

const csvData = ref([])

const equipements = ref(null);
const input_modele = ref();
const input_status = ref(false);
const input_date_installation = ref();
const input_date = ref();
const input_url_administration = ref();
const input_libelle = ref();
const id_association = ref();

const selected_equipement = ref();
const liste_finale = ref(null);

const input_caracteristiques = ref();


///////////////////////// GESTION DE LA NAVIGATION //////////////////////////
const route = useRoute()



const myHome = ref({
  icon: 'fa-solid fa-home',
  to: '/'
})

const myItems = ref([])

watch(equipements, async (newEquipements, oldEquipements) => {
  if (newEquipements != null) {
    //add zone to breadcrumb
    myItems.value = [
      {
        label: 'Zones',
        to: '/Zones'
      },
      {
        label: newEquipements.batiment.zone.libelle_long,
        to: '/Zones/' + newEquipements.batiment.zone.id + '/Bat'
      },
      {
        label: newEquipements.batiment.libelle_long,
        to: '/Zones/' + newEquipements.batiment.zone.id + '/Bat/' + newEquipements.batiment.id + '/Salles'
      },
      {
        label: equipements.value.libelle,
        to: '/Zones/' + newEquipements.batiment.zone.id + '/Bat/' + newEquipements.batiment.id + '/Salles/' + newEquipements.id + '/Equipements'
      },
    ]
  }
  return myItems.value
})

///////////////////////// GESTION DES EQUIPEMENTS //////////////////////////

//let id_association = null

const responsiveOptions = ref([{
  breakpoint: '1024px',
  numVisible: 5
},
{
  breakpoint: '768px',
  numVisible: 3
},
{
  breakpoint: '560px',
  numVisible: 1
}
],
);

const displayCustom = ref(false)



onBeforeMount(async () => {
  if (!equipements.value) {
    AssociationController.fetchAssociationsBySalle(apiClient, route.params.id_salle).then(response => {
      equipements.value = response.data.equipements_list
      liste_finale.value = equipements.value.associations.filter(association => association.status == false)
      equipements.value.associations.forEach(eq => {
        if (eq.modele_equipement.type_equipement.nom === 'Vidéoprojecteur')
          eq.power = false
      });
      console.log(liste_finale.value)
      liste_finale.value.forEach(eq => {
        if (eq.modele_equipement.type_equipement.nom === 'Vidéoprojecteur')
          eq.power = false
      })
    })
  }
})


watch(equipements, async (newEquipements, oldEquipements) => {
  if (newEquipements != null) {
    for (let i = 0; i < newEquipements.associations.length; i++) {
      let temp = new Object();
      temp.ensemble = newEquipements.associations[i].data_equipements.concat(newEquipements.associations[i].modele_equipement.data_modeles)// Object() constructor function
      Object.assign(newEquipements.associations[i], temp)
    }
    equipements.value = newEquipements
    liste_finale.value = equipements.value.associations.filter(association => association.status == false)
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

/*let liste_modeles = ref(null);
onMounted(async () => {
  if (!liste_modeles.value) {
    ModeleEquipementController.fetchModeleEquipementByType(apiClient, id_type_equipement).then(response => {
      liste_modeles.value = response.data.modeles_list
    })
  }
})*/

const liste_type_equipement = ref(null)
onMounted(async () => {
  if (!liste_type_equipement.value) {
    TypeEquipementController.fetchAllTypeEquipement(apiClient).then(response => {
      liste_type_equipement.value = response.data.type_equipement_list
    })
  }
})

const liste_modeles = ref(null)
const selected_type = ref(null)
watch(selected_type, async (newType, oldType) => {
  if (newType != oldType) {
    ModeleEquipementController.fetchModeleEquipementByType(apiClient, selected_type.value.id).then(response => {
      liste_modeles.value = response.data.modeles_list
    })
  }
})

const modeles_equipement = ref(null);
onMounted(async () => {
  if (!modeles_equipement.value) {
    ModeleEquipementController.fetchAllModeleEquipements(apiClient).then(response => {
      modeles_equipement.value = response.data.modeles_list
    })
  }
})

const expandedRows = ref([]);




//Fonctions de création, modification, suppression
const selected_modele = ref(null)
function createEquipement() {
  AssociationController.createAssociation(apiClient, route.params.id_salle, selected_modele.value.id, input_status.value, input_date.value, input_url_administration.value, input_libelle.value, input_date_installation.value).then(response => {
    if (response.data != null) {
      if (input_caracteristiques.value != null) {
        //for each input_caracteristiques.value, we create a data_equipement
        for (let i = 0; i < input_caracteristiques.value.length; i++) {
          DataEquipementController.createDataEquipement(apiClient, input_caracteristiques.value[i].valeur, input_caracteristiques.value[i].id, response.data.Association.id, route.params.id_salle).then(response => {
          })
        }
      }
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Equipement créé', life: 3000 });
      AssociationController.fetchAssociationsBySalle(apiClient, route.params.id_salle).then(response => {
        equipements.value = response.data.equipements_list
      })
      displayCreateDialog.value = false
    }
    else {
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Equipement non créé', life: 3000 });
      displayCreateDialog.value = false
    }
  })
}

function deleteEquipement() {
  DataEquipementController.deleteDataEquipementByEquipement(apiClient, id_association.value).then(response => {
    if (response.data != null) {
      AssociationController.deleteAssociation(apiClient, id_association.value).then(response => {
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Equipement supprimé', life: 3000 });
        AssociationController.fetchAssociationsBySalle(apiClient, route.params.id_salle).then(response => {
          equipements.value = response.data.equipements_list
        })
        displayDeleteDialog.value = false
      })
    }
    else {
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Equipement non supprimé', life: 3000 });
      displayDeleteDialog.value = false
    }
  })
}


function editEquipement() {
  AssociationController.editAssociation(apiClient, selected_equipement.value.id, selected_equipement.value.status, selected_equipement.value.date_archivage, selected_equipement.value.url_administration, selected_equipement.value.libelle, selected_equipement.value.date_installation).then(response => {
    if (response.data != null) {
      AssociationController.fetchAssociationsBySalle(apiClient, route.params.id_salle).then(response => {
        displayEditDialog.value = false
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Equipement édité', life: 3000 });
        equipements.value = response.data.equipements_list
      })
    }
  })
}

function redirect(url) {
  window.location.href = url;
}

const equipements_list_checked = ref(false);


watch(equipements_list_checked, async (newValue, oldValue) => {
  let liste1 = equipements.value.associations.filter(association => association.status == true)
  let liste2 = equipements.value.associations.filter(association => association.status == false)
  if (newValue == true) {
    liste_finale.value = liste1.concat(liste2)
  }
  else {
    liste_finale.value = liste2
  }
})

//fonctions pour afficher les formulaires

const displayCreateDialog = ref(false)
const displayDeleteDialog = ref(false)
const displayEditDialog = ref(false)
const displayDeleteDataEquipementDialog = ref(false)

const delete_data_equipement = ref(null)

function openCreateDialog() {
  displayCreateDialog.value = true
}

function openDeleteDialog(id_equipement) {
  id_association.value = id_equipement
  displayDeleteDialog.value = true
}

function openEditDialog(equipement) {
  selected_equipement.value = equipement
  displayEditDialog.value = true
}

onMounted(async () => {
  let projectors = []
  await new Promise((resolve) => {
    const check = setInterval(() => {
      if (equipements.value !== null) {
        clearInterval(check)
        equipements.value.associations.forEach(equipement => {
          if (equipement.modele_equipement.type_equipement.nom === "Vidéoprojecteur") {
            let data = projector.data_equipements.find((data) => data.caracteristique.grandeur === "Adresse IP")
            if(data !== null && data !== undefined) {
              projectors.push(equipement)
            }
          }
        })
        projectors.forEach(projector => {
          let data = projector.data_equipements.find((data) => data.caracteristique.grandeur === "Adresse IP")
          AssociationController.connect(apiClient, data.valeur).then(response => {
            console.log(response.data)
          })
        })
        resolve();
      }
    }, 100)
  })
})

function powerProjector(equipement) {
  let ip_address = equipement.data_equipements.find((data) => data.caracteristique.grandeur === "Adresse IP")
  AssociationController.powerProjector(apiClient, ip_address);
}

//create a computed property in order to to get the name of the selected caracteristique in the dropdown
const nameOfCaracteristique = computed(() => {
  return input_modele.value ? input_modele.value.nom : null;
});


//////////////////////////GESTION DES DOCUMENTS//////////////////////////
const documents = ref([]);

const files = ref([]);
const totalSize = ref(0);
const totalSizePercent = ref(0);

//const uploadedFiles = ref([]);
const uploadedFiles = ref([]);
const filesToDelete = ref([])
const activeIndex = ref(0);
const delete_button_checked = ref(false);
const chargementDocuments = ref(true)


onBeforeMount(() => {
  DocumentController.findBySalle(apiClient, route.params.id_salle).then(response => {
    uploadedFiles.value = response.data.Documents
    uploadedFiles.value.forEach((file) => {
      if (file.type == "image") {
        file = new Image([file.hash], file.nom, { type: file.type })
      }
      else {
        file = new File([file.hash], file.nom, { type: file.type })
      }
      //for each file, we add the preview image to the object
      file.checked = false;
    })
    chargementDocuments.value = false;
  })
})


function imageClick(index) {
  activeIndex.value = index;
  displayCustom.value = true;
}

const formatSize = (bytes) => {
  if (bytes === 0) {
    return '0 B';
  }

  let k = 1000,
    dm = 3,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


////UPLOAD FILES


const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
}

//make a function to convert any type of image to a base64 string
function fileToImage(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let image = new Image();
      image.src = reader.result;
      resolve(image);
    };
    reader.onerror = error => reject(error);
  });
}

//make a function to convert any type of file to a base64 string
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

//make a function to check if a file is a document or an image
function checkType(file) {
  if (file.type.includes('image')) {
    return 'image'
  }
  else {
    return 'document'
  }
}

//make a function that

async function preprocess(file) {
  let data = {
    name: file.name,
    hash: null,
    type_document: null,
  }
  data.type_document = checkType(file)
  if (data.type_document == 'image') {
    let image = await fileToImage(file)
    data.hash = image.src
  }
  else {
    let hash = await fileToBase64(file)
    data.hash = hash
  }
  return data
}

const onUpload = async () => {
  for (let i = 0; i < files.value.length; i++) {
    let data = await preprocess(files.value[i])
    DocumentController.insertDocument(apiClient, data.name, data.hash, data.type_document, route.params.id_salle, null, null).then(response => {
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



////DELETE FILES

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





const onRemoveTemplatingFile = (file, onFileRemove, index) => {
  onFileRemove(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
}


function generatePDF(file) {
  var link = document.createElement('a');
  link.download = file.nom;
  file.hash.replace('data:application/pdf;base64', 'data:application/octet-stream;base64');
  link.href = file.hash;
  link.click();
}

//////////////////////////GESTION DES USAGES//////////////////////////
const usages = ref(null);
const type_usages = ref(null);
const displayDeleteDialogUsage = ref(false)
const displayCreateDialogUsage = ref(false)
const selected_usage = ref()
const selected_usages = ref()

function openCreateDialogUsage() {
  selected_usages.value = null;
  displayCreateDialogUsage.value = true
}

function openDeleteDialogUsage(id_usage) {
  selected_usage.value = id_usage
  displayDeleteDialogUsage.value = true
}

onMounted(async () => {
  if (!usages.value) {
    await UsageController.fetchAllUsageBySalle(apiClient, route.params.id_salle).then(response => {
      usages.value = response.data.usages_list
    })
  }
})
onMounted(async () => {
  if (!type_usages.value) {
    TypeUsageController.fetchAllTypeUsage(apiClient).then(response => {
      type_usages.value = response.data.type_usage_list
    })
  }
})

function createUsage() {
  for (let i = 0; i < selected_usages.value.length; i++) {
    UsageController.createUsage(apiClient, selected_usages.value[i], route.params.id_salle).then(response => {
      if (response.data.Usage) {
        displayCreateDialogUsage.value = false;
        UsageController.fetchAllUsageBySalle(apiClient, route.params.id_salle).then(response => {
          usages.value = response.data.usages_list
        })
      }
    })
  }
  toast.add({ severity: 'success', summary: 'Succès', detail: "Usage ajoutée", life: 3000 });

}

function deleteUsage() {
  UsageController.deleteUsage(apiClient, selected_usage.value.id).then((response) => {
    if (response.data.destroyed == 1) {
      UsageController.fetchAllUsageBySalle(apiClient, route.params.id_salle).then(response => {
        usages.value = response.data.usages_list
      })
      displayDeleteDialogUsage.value = false;
      toast.add({
        severity: "success",
        summary: "Succès",
        detail: "Usage supprimé",
        life: 3000,
      });
    }
  });
}

watch(equipements, async () => {
    liste_finale.value.forEach(equipement => {
      let date_archivage = null
      if(equipement.status !== false) {
        date_archivage = JSON.stringify(equipement.date_archivage)
      } else {
        date_archivage = "Equipement non archive"
      }

      if(!csvData.value.includes(equipement.modele_equipement.type_equipement.nom && equipement.modele_equipement.marque && equipement.modele_equipement.modele)) {

      equipement.data_equipements.forEach(data_equipement => {
  let caracteristique_equipement = data_equipement.caracteristique.grandeur;
  
  equipement.modele_equipement.data_modeles.forEach(data_modele => {
    let caracteristique_modele = data_modele.caracteristique.grandeur;
    
    const row = {
      "Type d'equipement": equipement.modele_equipement.type_equipement.nom,
      "Marque": equipement.modele_equipement.marque,
      "Modele": equipement.modele_equipement.modele,
      "Nom": equipement.modele_equipement.libelle,
      "Archive": equipement.status,
      "Date d'archivage": JSON.stringify(equipement.date_archivage),
      "Date d'installation": JSON.stringify(equipement.date_installation),
      [caracteristique_equipement]: data_equipement.valeur,
      [caracteristique_modele]: data_modele.valeur
    };

    csvData.value.push(row);
  });
});

      }

    })
  return csvData.value
})


</script>




<template>
  <div>
    <BreadCrumbVue :items="myItems" :home="myHome" v-if="equipements"></BreadCrumbVue>
    <Toast />
    <div class="flex align-content-around flex-column card-container">
      <span class="flex align-items-center text-2xl w-30rem" v-if="equipements"> <i class="fa-solid fa-chair mr-3"></i> {{
        equipements.libelle }}</span>
    </div>
    <TabView ref="tabview1">
      <TabPanel header="Équipements">
        <DataTable :value="liste_finale" responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm"
          :paginator="true" :rows="10" v-model:expandedRows="expandedRows" dataKey="id" v-if="equipements">

          <template #header>
            <div class="flex justify-content-between flex-wrap card-container">
              <span class="flex align-items-center" v-if="equipements">Liste des équipements</span>
              <div class="flex">
                <div class="flex align-items-center pr-4">
                  <span class="mr-2">Voir archivés</span>
                  <InputSwitch v-model="equipements_list_checked" class="p-mr-2" />
                </div>
                <Button label="Ajouter un équipement" class="p-button-success w-17rem" icon="pi pi-plus"
                  @click="openCreateDialog" v-if="authStore.isAdmin"></Button>
              </div>
            </div>
          </template>
          <Column header="Type d'équipement" :sortable="true">
            <template #body="slotProps">
              <span v-html="slotProps.data.modele_equipement.type_equipement?.icon"></span>
              {{ slotProps.data.modele_equipement.type_equipement?.nom }}
            </template>
          </Column>
          <Column field="modele_equipement.marque" header="Marque" :sortable="true"></Column>
          <Column field="modele_equipement.modele" header="Modèle" :sortable="true"></Column>
          <Column field="libelle" header="Libellé" :sortable="true"></Column>
          <Column field="date_installation" header="Date d'installation" :sortable="true">
            <template #body="slotProps">
              <div v-if="slotProps.data.date_installation != null">
                {{ moment(slotProps.data.date_installation).format('DD/MM/YYYY') }}
              </div>
              <div v-else>
              </div>
            </template>
          </Column>
          <Column header="Equipement archivé" :sortable="true" bodyStyle="text-align:center">
            <template #body="slotProps">
              <i class="fa-solid fa-check" v-if="slotProps.data.status == 1"></i>
              <i class="fa-solid fa-times" v-else></i>
            </template>
          </Column>

          <Column header="Date d'archivage" :sortable="true">
            <template #body="slotProps">
              <span v-if="slotProps.data.status == 1">{{ moment(slotProps.data.date_archivage).format('DD/MM/YYYY')
              }}</span>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="fa-solid fa-pencil" class="p-button-warning p-button-text"
                @click="openEditDialog(slotProps.data)" v-if="authStore.isOperateur"></Button>
              <Button icon="fa-solid fa-trash" class="p-button-danger p-button-text"
                @click="openDeleteDialog(slotProps.data.id)" v-if="authStore.isAdmin"></Button>
              <ToggleButton v-model="slotProps.data.power"
                v-if="slotProps.data.modele_equipement.type_equipement.nom === 'Vidéoprojecteur'"
                @click="powerProjector(slotProps.data)" onLabel="" offLabel="" onIcon="fa-solid fa-power-off"
                offIcon="fa-solid fa-power-off" />
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <Button label="Site administration" class="p-button-primary p-button-outlined p-button-sm p-button"
                icon="fa-solid fa-globe" target="_self" @click="redirect(slotProps.data.url_administration)"
                v-if="slotProps.data.url_administration != null && slotProps.data.url_administration !== ''">
              </Button>
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <div class="flex flex-wrap flex-row">
                <div class="flex align-items-center justify-content-center">
                  <router-link :to="({ name: 'EquipementDetails', params: { id_equipement: slotProps.data.id } })"
                    class="pr-2" style="text-decoration: none; color:#2c3e50">
                    <Button type="button" label="Détails équipement" icon="fa-solid fa-circle-info"
                      class="p-button-primary p-button-outlined p-button-sm p-button" />
                  </router-link>
                </div>
              </div>
            </template>
          </Column>
          <template #footer>
            <Button type="button" icon="fa-solid fa-circle-info"
                      class="p-button-primary p-button-sm p-button">
                      <download-csv
	            :data   = "csvData"
              :separator-excel = "true"
	            name = "_export_equipements.csv">
	            Exporter fichier CSV
            </download-csv>   
            </Button>
 </template>
        </DataTable>

      </TabPanel>
      <TabPanel header="Photos">
        <div>
          <div class="flex justify-content-between flex-wrap mb-4">
            <span class="flex align-items-center" v-if="uploadedFiles">
              {{ uploadedFiles.filter((file) => file.type_document == 'image').length }} photo(s)
            </span>
            <div class="flex">
              <Button label="Supprimer"
                v-if="delete_button_checked != false && (uploadedFiles.filter((file) => file.type_document == 'image')).length > 0"
                @click="deleteDocument" class="p-button p-button-danger ml-3" />

              <ToggleButton v-model="delete_button_checked"
                v-if="(uploadedFiles.filter((file) => file.type_document == 'image')).length == 0 && authStore.isOperateur"
                offLabel="Supprimer des photos" onLabel="Annuler" disabled class="p-button-outlined p-button-danger" />
              <ToggleButton v-model="delete_button_checked" v-else-if="authStore.isOperateur"
                offLabel="Supprimer des photos" onLabel="Annuler" class="p-button-outlined p-button-danger" />
            </div>
          </div>



          <div class="justify-content-center">
            <div v-if="chargementDocuments" class="grid">
              <div v-bind:key="n" v-for="n in 12" class="col-12 md:col-6 lg:col-3 xl:col-2">
                <Skeleton :pt="{
                  root: { class: 'w-full h-15rem' }
                }" />
              </div>
            </div>
            <div v-if="uploadedFiles" class="grid">
              <div v-for="(file, index) of uploadedFiles.filter((file) => file.type_document == 'image')" :key="index"
                class="col-12 md:col-6 lg:col-3 xl:col-2">
                <Image :src="file.hash" preview :pt="{
                  image: { class: 'w-full' }
                }" />
                <Checkbox v-model="file.checked" :binary="true" v-if="delete_button_checked == true" />
              </div>
            </div>
          </div>
          <FileUpload :showUploadButton="false" :showCancelButton="false" :auto="true" name="demo[]"
            @upload="onTemplatedUpload($event)" :multiple="true" :maxFileSize="10000000" @select="onSelectedFiles"
            :customUpload="true" @uploader="onUpload" v-if="authStore.isOperateur" accept="image/*">
            <template #empty>
              <div class="flex align-items-center justify-content-center flex-column">
                <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                <p class="mt-4 mb-0">Faites glisser et déposez les photos <b>ici</b> pour les télécharger.</p>
              </div>
            </template>
          </FileUpload>
        </div>
      </TabPanel>
      <TabPanel header="Documents">
        <div>
          <div class="flex justify-content-between flex-wrap mb-4">
            <span class="flex align-items-center" v-if="uploadedFiles">
              {{ uploadedFiles.filter((file) => file.type_document == 'document').length }} document(s)
            </span>
            <div class="flex">
              <Button label="Supprimer"
                v-if="delete_button_checked != false && (uploadedFiles.filter((file) => file.type_document == 'document')).length > 0"
                @click="deleteDocument" class="p-button p-button-danger ml-3" />

              <ToggleButton v-model="delete_button_checked"
                v-if="(uploadedFiles.filter((file) => file.type_document == 'document')).length == 0 && authStore.isOperateur"
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
        <FileUpload :showUploadButton="false" :showCancelButton="false" :auto="true" name="demo2[]" :customUpload="true"
          @uploader="onUpload" :multiple="true" :maxFileSize="1000000" @select="onSelectedFiles">
          <template #empty>
            <div class="flex align-items-center justify-content-center flex-column">
              <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
              <p class="mt-4 mb-0">Faites glisser et déposez les fichiers <b>ici</b> pour les télécharger.</p>
            </div>
          </template>
        </FileUpload>
      </TabPanel>
      <TabPanel header="Usages">
        <div>
          <DataTable :value="usages" stripedRows responsiveLayout="stack" breakpoint="960px" class="p-datatable-sm"
            :paginator="true" :rows="10" v-if="usages">
            <template #header>
              <div class="flex justify-content-between flex-wrap card-container">
                <span class="flex align-items-center" v-if="usages">Liste des usages</span>
                <div class="flex">
                  <Button label="Ajouter des usages" class="p-button-success w-15rem" icon="pi pi-plus"
                    @click="openCreateDialogUsage" v-if="authStore.isAdmin"></Button>
                </div>
              </div>
            </template>
            <template #empty>
              <div class="text-center m-4">Aucun usage.</div>
            </template>
            <Column field="usages_salle.fonctionnalite" header="Usage" :sortable="true"></Column>
            <Column field="id" header="Action" v-if="authStore.isAdmin">
              <template #body="slotProps">
                <div class="flex flex-wrap flex-row">
                  <div class="flex align-items-center justify-content-center">
                    <Button icon="fa-solid fa-trash" class=" p-button-danger p-button-text"
                      @click="openDeleteDialogUsage(slotProps.data)" v-if="authStore.isAdmin" />
                  </div>

                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </TabView>
  </div>


  <Dialog header="Ajouter un équipement" v-model:visible="displayCreateDialog" :modal="true" :closable="true"
    :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '45vw' }">
    <div class="fluid formgrid grid">
      <div class="col-6 field">
        <Dropdown v-model="selected_type" editable :options="liste_type_equipement" optionLabel="nom"
          placeholder="Selectionner un type" class="w-full" />
      </div>
      <div class="col-6 field">
        <Dropdown v-model="selected_modele" editable :options="liste_modeles" optionLabel="modele"
          placeholder="Selectionner un modèle" class="w-full" />
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
        <Calendar inputId="icon" class="w-full" v-model="input_date_installation" :showIcon="true" :readonly="false"
          showButtonBar />
      </div>
      <div class="field col-6">
        <ToggleButton v-model="input_status" onLabel="Archivé" offLabel="Présent" class="w-full" />
      </div>
      <!--Calendar-->
      <div class="col-6">
        <Calendar inputId="icon" class="w-full" v-model="input_date" :showIcon="true" v-if="input_status == true"
          :readonly="false" showButtonBar />
        <Calendar inputId="icon" disabled="disabled" class="w-full" :showIcon="true" v-if="input_status == false"
          :readonly="false" showButtonBar />
      </div>
    </div>
    <div class="fluid formgrid grid">

      <div class="field col-12 ">
        <MultiSelect v-model="input_caracteristiques" :options="listeCaracteristiquesModifiables" optionLabel="grandeur"
          placeholder="Liste des caractéristiques" class="w-full" />
      </div>
      <div class="field col-12" v-for="caracteristique in input_caracteristiques" :key="caracteristique.id">
        <Dropdown :options="caracteristique.valeur_default.split(';')" v-model="caracteristique.valeur"
          :placeholder="'Valeur ' + caracteristique.grandeur" class="w-full"
          v-if="caracteristique.valeur_default != null && caracteristique.valeur_default != ''" />
        <InputText v-model="caracteristique.valeur" :placeholder="'Valeur ' + caracteristique.grandeur" class="w-full"
          v-else />
      </div>
    </div>

    <template #footer>
      <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class=" p-button-text" @click="displayCreateDialog = false" />
          <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
            v-if="selected_modele == null || selected_modele == ''" autofocus />
          <Button label="Ajouter" icon="pi pi-check" @click="createEquipement" v-else autofocus />
        </div>
      </div>
    </template>
  </Dialog>


  <!--Delete Equipement dialog-->
  <Dialog header="Supprimer l'équipement" v-model:visible="displayDeleteDialog" :modal="true" :closable="true"
    :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
    <div class="fluid">
      <div class="field">
        <p>Êtes-vous sûr de vouloir supprimer cet équipement ?</p>
      </div>
    </div>
    <template #footer>
      <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialog = false" />
      <Button label="Supprimer" icon="pi pi-check" class="p-button-outlined p-button-secondary"
        @click="deleteEquipement" />
    </template>
  </Dialog>

  <Dialog header="Supprimer l'usage de cette salle" v-model:visible="displayDeleteDialogUsage" :modal="true"
    :closable="true" :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960"
    :style="{ width: '35vw' }">
    <div class="fluid">
      <div class="field">
        <p>Êtes-vous sûr de vouloir supprimer cet usage ?</p>
      </div>
    </div>
    <template #footer>
      <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayDeleteDialogUsage = false" />
      <Button label="Supprimer" icon="pi pi-check" class="p-button-outlined p-button-secondary" @click="deleteUsage" />
    </template>
  </Dialog>



  <Dialog header="Editer l'équipement" v-model:visible="displayEditDialog" :modal="true" :closable="true"
    :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '35vw' }">
    <div class="fluid formgrid grid">
      <div class="col-12 field">
        <InputText v-model="selected_equipement.libelle" placeholder="Libellé" class="w-full" />
      </div>
      <div class="col-6 field">
        <InputText v-model="selected_equipement.url_administration" placeholder="URL d'administration" class="w-full" />
      </div>
      <div class="col-6 field">
        <Calendar inputId="icon" class="w-full" v-model="selected_equipement.date_installation" :showIcon="true"
          showButtonBar />
      </div>
      <div class="field col-6">
        <ToggleButton v-model="selected_equipement.status" onLabel="Archivé" offLabel="Présent" class="w-full" />
      </div>
      <div class="col-6">
        <Calendar inputId="icon" class="w-full" v-model="selected_equipement.date_archivage" :showIcon="true"
          showButtonBar v-if="selected_equipement.status == true" />
        <Calendar inputId="icon" disabled="disabled" class="w-full" :showIcon="true" showButtonBar
          v-if="selected_equipement.status == false" />
      </div>
    </div>
    <template #footer>
      <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="displayEditDialog = false" />
      <Button label="Modifier" icon="pi pi-check" class="p-button-primary" @click="editEquipement()" />
    </template>
  </Dialog>


  <Dialog header="Ajouter des usages" v-model:visible="displayCreateDialogUsage" :modal="true" :closable="true"
    :dismissableMask="true" :responsive="true" :showHeader="true" :breakpoint="960" :style="{ width: '45vw' }">
    <div class="formgrid grid">
      <div class="col-12">
        <div v-for="usage of type_usages" :key="usage.key" class="flex align-items-center m-2">
          <Checkbox class="mr-2" v-model="selected_usages" :inputId="usage.key" name="usage" :value="usage.id" />
          <label :for="usage.key">{{ usage.fonctionnalite }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="formgrid grid">
        <div class="col-12">
          <Button label="Annuler" icon="pi pi-times" class=" p-button-text" @click="displayCreateDialogUsage = false" />
          <Button label="Ajouter" icon="pi pi-check" disabled="disabled"
            v-if="selected_usages == null || selected_usages.length == 0" autofocus />
          <Button label="Ajouter" icon="pi pi-check" @click="createUsage" v-else autofocus />
        </div>
    </div>
  </template>
</Dialog></template>

<style scoped></style>