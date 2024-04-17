export default {
    async fetchAllAssociations(apiClient) {
        return await apiClient.get('Association')
    },
    async fetchAssociationById(apiClient, id_association){
        return await apiClient.get("Association/id/" + id_association)
    },
    async fetchAssociationsBySalle(apiClient, id_salle){
        return await apiClient.get("Association/" + id_salle + "/associations")
    },
    async fetchSalleByEquipement(apiClient, id_modele_equipement){
        return await apiClient.get("Association/" + id_modele_equipement + "/equipements")
    },
    async createAssociation(apiClient, id_salle, id_modele_equipement, status, date_archivage, url_administration, libelle, date_installation){
        return await apiClient.post("Association", {id_salle, id_modele_equipement, status, date_archivage, url_administration, libelle, date_installation})
    },
    async deleteAssociation(apiClient, id_association){
        return await apiClient.delete("Association/" + id_association)
    },
    async editAssociation(apiClient, id_association, status, date_archivage, url_administration, libelle, date_installation){
        return await apiClient.put("Association/" + id_association, {status, date_archivage, url_administration, libelle, date_installation})
    },
    async connect(apiClient, ip_address) {
        return await apiClient.get("Association/connect", {ip_address})
    },
    async powerProjector(apiClient, ip_adress) {
        return await apiClient.post("Association/powerProjector", {ip_adress})
    }
}