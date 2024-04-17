export default {
    async fetchAllModeleEquipements(apiClient) {
        return await apiClient.get('ModeleEquipement')
    },
    async fetchModeleEquipementById(apiClient, id_modele_equipement){
        return await apiClient.get("ModeleEquipement/id/" + id_modele_equipement)
    },
    async fetchModeleEquipementByType(apiClient, id_type_equipement){
        return await apiClient.get("ModeleEquipement/type_equipement/" + id_type_equipement)
    },
    async deleteModeleEquipement(apiClient, id_modele){
        return await apiClient.delete("ModeleEquipement/" + id_modele)
    },
    async editModeleEquipement(apiClient, idModele, marque, modele, dispo_vente, id_type_equipement){
        return await apiClient.put("ModeleEquipement/" +idModele, {marque, modele, dispo_vente, id_type_equipement})
    },
    async createModeleEquipement(apiClient, marque, modele, dispo_vente, id_type_equipement){
        return await apiClient.post("ModeleEquipement", {marque, modele, dispo_vente, id_type_equipement})
    },

}