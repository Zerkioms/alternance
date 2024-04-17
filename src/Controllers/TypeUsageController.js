export default {
    async createTypeUsage(apiClient, fonctionnalite){
        return await apiClient.post("Type_Usage", {fonctionnalite})
    },
    async fetchAllTypeUsage(apiClient) {
        return await apiClient.get('Type_Usage')
    },
    async deleteTypeUsage(apiClient, id_type_usage) {
        return await apiClient.delete("Type_Usage/" + id_type_usage)
    },
    async editTypeUsage(apiClient, id_type_usage, fonctionnalite) {
        return await apiClient.put("Type_Usage/" + id_type_usage, {fonctionnalite})
    }
}