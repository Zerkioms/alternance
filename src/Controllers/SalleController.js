export default {
    async fetchAllSalles(apiClient) {
        return await apiClient.get('salles')
    },

    async fetchSallesByBatiment(apiClient, id_batiment) {
        return await apiClient.get("salles/batiment/" + id_batiment);
    },
    async fetchSalleById(apiClient, id_salle){
       return await apiClient.get("salles/id/" + id_salle)
    },

    async createSalle(apiClient, libelle, etage, id_batiment, id_type_salle){
        return await apiClient.post("salles", {libelle, etage, id_batiment, id_type_salle})
    },
    async deleteSalle(apiClient, id_salle){
        return await apiClient.delete("salles/" + id_salle)
    },
    async editSalle(apiClient, id_salle, libelle, etage, id_type_salle){
        return await apiClient.put("salles/" +id_salle, {libelle, etage, id_type_salle})
    },
    async fetchTypeSalleById(apiClient, id_salle){
        return await apiClient.get("salles/TypeSalle/" + id_salle)
    },
}