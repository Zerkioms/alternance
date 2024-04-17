import { defineStore } from "pinia";
import UserController from "../Controllers/UserController";
import { useApiClient } from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";

export const useAuthStore = defineStore({
  id: "useAuthStore",
  state: () => {
    return {
    user: {},
    isAdmin: false,
    isOperateur: false,
    isVisiteur: false,
    isLogged: false,
    };
  },
  //si le user est connecté, on récupère ses infos par authData.connectUser et on les stocke dans le store et on passe isLogged à true, sinon on passe isLogged à false. Puis on récupère les rôles de l'utilisateur via UserController.fetchUserByUid et en mettant en paramètre l'uid de l'utilisateur par authData.connectedUser.profile.uid. Enfin, on stocke response.data.user.role.role dans le store. Si le role est admin, on passe isAdmin à true, si le role est operateur, on passe isOperateur à true, si le role est visiteur, on passe isVisiteur à true.
  actions: {
    async init(authData) {
      const store = this;
      if (authData.connectedUser) {
        store.$state.isLogged = true;
        store.$state.user = authData.connectedUser;
        const apiClient = useApiClient();
        while (!store.$state.user) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
          UserController.fetchUserByUid(apiClient, store.$state.user.profile.uid).then((response) => {
            if (response.data.user.role.role === "admin") {
              store.$state.isAdmin = true;
              store.$state.isOperateur = true;
              store.$state.isVisiteur = true;
            } else if (response.data.user.role.role === "operateur") {
              store.$state.isOperateur = true;
              store.$state.isVisiteur = true;
            } else if (response.data.user.role.role === "visiteur") {
              store.$state.isVisiteur = true;
            }
          });
      } else {
        store.$state.isLogged = false;
      }
    },
    async logout() {
      const store = this;
      store.$state.isLogged = false;
      store.$state.isAdmin = false;
      store.$state.isOperateur = false;
      store.$state.isVisiteur = false;
      store.$state.user = {};
    }

  }
});
