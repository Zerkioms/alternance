

export default {
   async fetchAllLogs(apiClient) {
        return await apiClient.get('Logs')
    }
}