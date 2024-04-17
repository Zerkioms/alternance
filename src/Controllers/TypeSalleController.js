export default {
    async fetchAllTypesSalles(apiClient) {
        return await apiClient.get('TypeSalle')
    },
    async fetchTypeSalleById(apiClient, id_type_salle){
        return await apiClient.get("TypeSalle/id/" + id_type_salle)
    },
    async fetchTypeSalleByDesignation(apiClient, designation) {
        return await apiClient.get("TypeSalle/designation", {designation})
    }
}