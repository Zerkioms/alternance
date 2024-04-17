export default {
    async fetchAllTypeEquipement(apiClient) {
        return await apiClient.get('Type_Equipement')
    },
    async fetchTypeEquipementById(apiClient, id_type_equipement){
        return await apiClient.get("Type_Equipement/id/" + id_type_equipement)
    },
    async deleteTypeEquipement(apiClient, id_type_equipement){
        return await apiClient.delete("Type_Equipement/" + id_type_equipement)
    },
    async editTypeEquipement(apiClient, id_type_equipement, nom, icon){
        return await apiClient.put("Type_Equipement/" + id_type_equipement, {nom, icon})
    },
    async createTypeEquipement(apiClient, nom, icon){
        return await apiClient.post("Type_Equipement", {nom, icon})
    },
}