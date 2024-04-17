// Import des éléments de vue-router
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";

// Objet qui contient les routes de l'application
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Accueil",
      component: () => import("@/Pages/Accueil.vue"),
      meta: {
        authenticationRequired: false,
        label: "Accueil",
        mainMenuPosition: 0,
      },
    },
    {
      path: "/Zones",
      name: "Zones",
      component: () => import("@/Pages/Zones.vue"),
      meta: { authenticationRequired: true },
    },
    {
      path: "/Zones/:id_zone/Bat",
      name: "Batiments",
      component: () => import("@/Pages/Batiments.vue"),
      meta: {
        authenticationRequired: true,
        title: "Batiments",
      },
    },
    {
      path: "/Zones/:id_zone/Bat/:id_batiment/Salles",
      name: "Salles",
      component: () => import("@/Pages/Salles.vue"),
      meta: {
        authenticationRequired: true,
        title: "Salles",
      },
    },
    {
      path: "/Zones/:id_zone/Bat/:id_batiment/Salles/:id_salle/Equipements",
      name: "Equipements",
      component: () => import("@/Pages/Equipements.vue"),
      meta: {
        authenticationRequired: true,
        title: "Equipements",
      },
    },
    {
      path: "/Zones/:id_zone/Bat/:id_batiment/Salles/:id_salle/Equipements/:id_equipement",
      name: "EquipementDetails",
      component: () => import("@/Pages/EquipementDetails.vue"),
      meta: {
        authenticationRequired: true,
        title: "EquipementDetails",
      },
    },
    {
      path: "/Type_Equipement",
      name: "Type_Equipement",
      component: () => import("@/Pages/Type_Equipement.vue"),
      meta: {
        authenticationRequired: true,
        title: "Type_Equipement",
      },
    },
    {
      path: "/Caracteristiques",
      name: "Caracteristiques",
      component: () => import("@/Pages/Caracteristiques.vue"),
      meta: {
        authenticationRequired: true,
        title: "Caracteristiques",
      },
    },
    {
      path: "/Modeles_Equipement",
      name: "Modeles_Equipement",
      component: () => import("@/Pages/Modeles_Equipement.vue"),
      meta: {
        authenticationRequired: true,
        title: "Modeles_Equipement",
      },
    },
    {
      path: "/Modeles_Equipement/:id/Caracteristiques",
      name: "CaracteristiquesModele",
      component: () => import("@/Pages/CaracteristiquesModele.vue"),
      meta: {
        authenticationRequired: true,
        title: "CaracteristiquesModele",
      },
    },
    {
      path: "/Logs",
      name: "Logs",
      component: () => import("@/Pages/Logs.vue"),
      meta: {
        authenticationRequired: true,
        title: "Logs",
      },
    },
    {
      path: "/Administration",
      name: "Administration",
      component: () => import("@/Pages/Administration.vue"),
      meta: {
        authenticationRequired: true,
        title: "Administration",
      },
    },
    {
      path: "/Type_Usage",
      name: "Type_Usage",
      component: () => import("@/Pages/Type_Usage.vue"),
      meta: {
        authenticationRequired: true,
        title: "Type_Usage",
      },
    },
    {
      path: "/Recherche",
      name: "Recherche",
      component: () => import("@/Pages/Recherche.vue"),
      meta: {
        authenticationRequired: true,
        title: "Recherche",
      },
    },

    {
      path: "/:pathMatch(.)",
      name: "NotFound",
      component: () => import("../Pages/NotFound.vue"),
    },
  ],
});
// export du router
export default router;