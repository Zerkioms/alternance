export default {
    async fetchAllDataModele(apiClient) {
        return await apiClient.get('DataModele')
    },
    async fetchDataModeleById(apiClient, id_data_modele){
        return await apiClient.get("DataModele/id/" + id_data_modele)
    },

    async fetchCaracteristiquesModele(apiClient, id_modele_equipement) {
        return await apiClient.get("DataModele/" + id_modele_equipement + "/caracteristiques")
    },
    async createDataModele(apiClient, id_caracteristiques, id_modele_equipement){
        return await apiClient.post("DataModele", {id_caracteristiques, id_modele_equipement})
    },
    async deleteCaracteristique(apiClient, id_data_modele){
        return await apiClient.delete("DataModele/" + id_data_modele)
    },
    async deleteCaracteristiquesByModele(apiClient, id_modele_equipement) {
        return await apiClient.delete("DataModele/modele_equipement/" + id_modele_equipement)
    },
    async updateDataModele(apiClient, id_data_modele, valeur){
        return await apiClient.put("DataModele/" + id_data_modele, {valeur})
    },
}