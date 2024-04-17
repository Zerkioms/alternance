export default {
    async fetchAllDataEquipements(apiClient) {
        return await apiClient.get('DataEquipement')
    },
    async fetchDataEquipementById(apiClient, id_data_equipement){
        return await apiClient.get("DataEquipement/id/" + id_data_equipement)
    },
    //create a new data_equipement
    async createDataEquipement(apiClient, valeur_caracteristiques, id_caracteristiques, id_association, id_salle){
        return await apiClient.post("DataEquipement", {valeur_caracteristiques, id_caracteristiques, id_association, id_salle})
    },
    async fetchCaracteristiquesAssociation(apiClient, id_association){
        return await apiClient.get("DataEquipement/association/" + id_association + "/caracteristiques")
    },
    //delete a data_equipement by id_association
    async deleteDataEquipementByEquipement(apiClient, id_association){
        return await apiClient.delete("DataEquipement/association/" + id_association )
    },
    //delete a data_equipement by id
    async deleteDataEquipementById(apiClient, id_data_equipement){
        return await apiClient.delete("DataEquipement/" + id_data_equipement )
    },
    //edit a data_equipement
    async editDataEquipement(apiClient, id_data_equipement, valeur){
        return await apiClient.put("DataEquipement/" + id_data_equipement, {valeur})
    }
    
}