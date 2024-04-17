export default {
    async insertDocument(apiClient, nom, hash, type_document, id_salle, id_modele, id_association){
        return await apiClient.post("Document", {nom, hash, type_document, id_salle, id_modele, id_association})
    },
    async findBySalle(apiClient, id_salle){
        return await apiClient.get("Document/salle/" + id_salle)
    },
    async deleteDocument(apiClient, id){
        return await apiClient.delete("Document/" + id)
    },
    async findByModele(apiClient, id_modele) {
        return await apiClient.get("Document/modele/" + id_modele)
    },
    async findByAssociation(apiClient, id_association) {
        return await apiClient.get("Document/association/" + id_association)
    }
}