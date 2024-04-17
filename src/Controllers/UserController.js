
export default {
    async fetchAllUsers(apiClient) {
        return await apiClient.get('User')
    },
    async fetchUserById(apiClient, id_user){
        return await apiClient.get("User/id/" + id_user)
    },
    async fetchUserByUid(apiClient, uid_user){
        return await apiClient.get('User/uid/' + uid_user)
    },
    async fetchRoles(apiClient){
        return await apiClient.get('User/roles')
    },
    async updateRole(apiClient, id_user, role){
        return await apiClient.put('User/role/' + id_user, {role: role})
    }
}