export default {
    async fetchAllBatiments(apiClient) {
        return await apiClient.get('batiments')
    },
    async fetchBatimentsByZone(apiClient, id_zone) {
        return await apiClient.get("batiments/zone/" + id_zone);
    },
    async fetchBatimentById(apiClient, id_batiment) {
        return await apiClient.get("batiments/id/" + id_batiment);
    },
    async createBatiment(apiClient, libelle_court, libelle_long, id_zone) {
        return await apiClient.post("batiments", {libelle_court, libelle_long, id_zone})
    },
    async editBatiment(apiClient, id_batiment, libelle_court, libelle_long) {
        return await apiClient.put("batiments/" + id_batiment, {libelle_court, libelle_long})
    },
    async deleteBatiment(apiClient, id_batiment) {
        return await apiClient.delete("batiments/" + id_batiment)
    }
}