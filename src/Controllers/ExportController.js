export default {
    async exportToXLSX(apiClient) {
        return await apiClient.get('Export')
    }
}