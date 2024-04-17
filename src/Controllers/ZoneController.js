
export default {
    async fetchAllZones(apiClient) {
        return await apiClient.get('Zone')
    },
    async fetchZoneById(apiClient, id_zone){
        return await apiClient.get("Zone/id/" + id_zone)
    },

    async createZone(apiClient, libelle_court, libelle_long){
        return await apiClient.post("Zone", {libelle_court, libelle_long})
    },
    async deleteZone(apiClient, id_zone){
        return await apiClient.delete("Zone/" + id_zone)
    },
    async editZone(apiClient, id_zone, libelle_court, libelle_long){
        return await apiClient.put("Zone/" + id_zone, {libelle_court, libelle_long})
    }
}