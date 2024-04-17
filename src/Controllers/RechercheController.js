export default {
    async fetchAllRecherche(apiClient) {
        return await apiClient.get('Recherche')
    }
}