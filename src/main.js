import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router/index";

import {
  authPlugin,
  apiClientPlugin,
} from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { apiClientPluginOptions, authPluginOptions } from "@/appSettings";

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import JsonCSV from 'vue-json-csv'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faDatabase,
  faDesktop,
  faPepperHot,
  faRightFromBracket,
  faGlobe,
  faUpRightFromSquare,
  faEnvelope,
  faExternalLinkAlt,
  faFax,
  faPhone,
  faMobileAlt,
  faHeadphonesAlt,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  locale: {
         "startsWith": "Commence par",
         "contains": "Contient",
         "notContains": "Ne contient pas",
         "endsWith": "Se termine par",
         "equals": "Égal à",
         "notEquals": "Différent de",
         "noFilter": "Aucun filtre",
         "lt": "Inférieur à",
         "lte": "Inférieur ou égal à",
         "gt": "Supérieur à",
         "gte": "Supérieur ou égal à",
         "dateIs": "La date est",
         "dateIsNot": "La date n'est pas",
         "dateBefore": "Avant le",
         "dateAfter": "Après le",
         "custom": "Personnalisé",
         "clear": "Effacer",
         "apply": "Appliquer",
         "matchAll": "Correspond à tous",
         "matchAny": "Au moins un Correspond",
         "addRule": "Ajouter une règle",
         "removeRule": "Retirer une règle",
         "accept": "Oui",
         "reject": "Non",
         "choose": "Choisir",
         "upload": "Envoyer",
         "cancel": "Annuler",
         "completed": "Terminé",
         "pending": "En attente",     
         "dayNames": ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
         "dayNamesShort": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
         "dayNamesMin": ["Di", "Lu", "Mar", "Mer", "Je", "Ve", "Sa"],
         "monthNames": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
         "monthNamesShort": ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Août", "Sept", "Oct", "Nov", "Dec"],
         "chooseYear": "Choisir une année",
         "chooseMonth": "Choisir un mois",
         "chooseDate": "Choisir une date",
         "prevDecade": "Décennie précédente",
         "nextDecade": "Décennie suivante",
         "prevYear": "Année précédente",
         "nextYear": "Année suivante",
         "prevMonth": "Mois précédent",
         "nextMonth": "Mois suivant",
         "prevHour": "Heure précédente",
         "nextHour": "Heure suivante",
         "prevMinute": "Minute précédente",
         "nextMinute": "Minute suivante",
         "prevSecond": "Seconde précédente",
         "nextSecond": "Seconde suivante",
         "am": "am",  // Abbreviation culturally accepted for french people. Real french translation is "du matin", but never used in web forms.
         "pm": "pm",  // Abbreviation culturally accepted for french people. Real french translation is "de l'après-midi", but never used in web forms.
         "today": "Aujourd'hui",
         "weekHeader": "Sem",
         "firstDayOfWeek": 1,
         "dateFormat": "dd/mm/yy",
         "weak": "Faible",
         "medium": "Moyen",
         "strong": "Fort",
         "passwordPrompt": "Saisissez un mot de passe",
         "emptyFilterMessage": "Aucun résultat trouvé",
         "searchMessage": "{0} résultats disponibles",
         "selectionMessage": "{0} éléments sélectionnés",
         "emptySelectionMessage": "Aucun élément sélectionné",
         "emptySearchMessage": "Aucun résultat trouvé",
         "emptyMessage": "Aucune option disponible",
         "aria": {
            "trueLabel": "Vrai",
            "falseLabel": "Faux",
            "nullLabel": "Aucune sélection",
            "star": "1 étoile",
            "stars": "{star} étoiles",
            "selectAll": "Tous éléments sélectionnés",
            "unselectAll": "Tous éléments désélectionnés",
            "close": "Fermer",
            "previous": "Précédent",
            "next": "Suivant",
            "navigation": "Navigation",
            "scrollTop": "Défiler tout en haut",
            "moveTop": "Déplacer tout en haut",
            "moveUp": "Déplacer vers le haut",
            "moveDown": "Déplacer vers le bas",
            "moveBottom": "Déplacer tout en bas",
            "moveToTarget": "Déplacer vers la cible",
            "moveToSource": "Déplacer vers la source",
            "moveAllToTarget": "Tout déplacer vers la cible",
            "moveAllToSource": "Tout déplacer vers la source",
            "pageLabel": "{page}",
            "firstPageLabel": "Première Page",
            "lastPageLabel": "Dernière Page",
            "nextPageLabel": "Page Suivante",
            "rowsPerPageLabel": "Lignes par page",
            "previousPageLabel": "Page précédente",
            "jumpToPageDropdownLabel": "Aller à la page",
            "jumpToPageInputLabel": "Aller à la page",
            "selectRow": "Ligne sélectionnée",
            "unselectRow": "Ligne désélectionnée",
            "expandRow": "Ligne dépliée",
            "collapseRow": "Ligne repliée",
            "showFilterMenu": "Montre le menu des filtres",
            "hideFilterMenu": "Masque le menu des filtres",
            "filterOperator": "Opérateur de filtrage",
            "filterConstraint": "Contrainte de filtrage",
            "editRow": "Édite une ligne",
            "saveEdit": "Sauvegarde l'édition",
            "cancelEdit": "Annule l'édition",
            "listView": "Vue en liste",
            "gridView": "Vue en grille",
            "slide": "Ascenceur",
            "slideNumber": "{slideNumber}",
            "zoomImage": "Zoomer l'image",
            "zoomIn": "Zoomer",
            "zoomOut": "Dézoomer",
            "rotateRight": "Tourner vers la droite",
            "rotateLeft": "Tourner vers la gauche"
         }
      }
});
app.use(createPinia());
app.use(ToastService);

// Plugins d'authentification
app.use(authPlugin, authPluginOptions);
app.use(apiClientPlugin, apiClientPluginOptions);

library.add(
  faDesktop,
  faPepperHot,
  faRightFromBracket,
  faDatabase,
  faUser,
  faGlobe,
  faUpRightFromSquare,
  faEnvelope,
  faExternalLinkAlt,
  faFax,
  faPhone,
  faMobileAlt,
  faHeadphonesAlt,
  faMapMarkedAlt
);

app.component('downloadCsv', JsonCSV)
app.component("fa-icon", FontAwesomeIcon);
app.mount("#app");