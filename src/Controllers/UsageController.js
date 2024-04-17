export default {
    async createUsage(apiClient, id_usage, id_salle){
        return await apiClient.post("Usage", {id_usage, id_salle})
    },
    async fetchAllUsage(apiClient) {
        return await apiClient.get('Usage')
    },
    async fetchAllUsageBySalle(apiClient, id_salle) {
        return await apiClient.get("Usage/salle/" + id_salle)
    },
    async deleteUsage(apiClient, id_usage) {
        return await apiClient.delete("Usage/" + id_usage)
    }
}