export default {
    async fetchAllCaracteristiques(apiClient) {
        return await apiClient.get('Caracteristiques')
    },
    async fetchCaracteristiqueById(apiClient, id_caracteristique){
        return await apiClient.get("Caracteristiques/id/" + id_caracteristique)
    },
    async deleteCaracteristiqueById(apiClient, id_caracteristique){
        return await apiClient.delete("Caracteristiques/" + id_caracteristique)
    },
    async updateCaracteristiqueById(apiClient, id_caracteristique, grandeur, type_valeur, unite, valeur_default, groupement, modifiable){
        return await apiClient.put("Caracteristiques/" + id_caracteristique, {grandeur, type_valeur, unite, valeur_default, groupement, modifiable})
    },
    async createCaracteristique(apiClient, grandeur, type_valeur, unite, valeur_default, groupement, modifiable){
        return await apiClient.post("Caracteristiques", {grandeur, type_valeur, unite, valeur_default, groupement, modifiable})
    },
    async fetchAllCaracteristiquesNonModifiable(apiClient) {
        return await apiClient.get('Caracteristiques/non_modifiable')
    },
    async fetchAllCaracteristiquesModifiable(apiClient) {
        return await apiClient.get('Caracteristiques/modifiable')
    },
}