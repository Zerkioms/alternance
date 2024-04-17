let grantList = [
    /* ******************* 
    PERMISSIONS ZONES
    ******************** */
    { role: 'admin', resource: 'Zone', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Zone', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Zone', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Zone', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Zone', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Zone', action: 'read:any', attributes: '*' },
    { role: 'operateur', resource: 'Zone', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Zone', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Zone', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Zone', action: 'read:any', attributes: '*' },
    { role: 'visiteur', resource: 'Zone', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Zone', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/


    /* ******************* 
    PERMISSIONS BATIMENTS
    ******************** */

    { role: 'admin', resource: 'batiments', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'batiments', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'batiments', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'batiments', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'batiments', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'batiments', action: 'read:any', attributes: '*' },
    { role: 'operateur', resource: 'batiments', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'batiments', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'batiments', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'batiments', action: 'read:any', attributes: '*' },
    { role: 'visiteur', resource: 'batiments', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'batiments', action: 'delete:own', attributes: '*' },

    /***********************************************************************************************/


    /* ******************* 
    PERMISSIONS SALLES
    ******************** */
    { role: 'admin', resource: 'salles', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'salles', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'salles', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'salles', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'salles', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'salles', action: 'read:any', attributes: '*' },
    { role: 'operateur', resource: 'salles', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'salles', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'salles', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'salles', action: 'read:any', attributes: '*' },
    { role: 'visiteur', resource: 'salles', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'salles', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

    /* ******************* 
    PERMISSIONS EQUIPEMENTS --> SALLES
    ******************** */
    { role: 'admin', resource: 'Association', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Association', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Association', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Association', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Association', action: 'create:any', attributes: '*, !views' },
    { role: 'operateur', resource: 'Association', action: 'read:any', attributes: '*' },
    { role: 'operateur', resource: 'Association', action: 'update:any', attributes: '*, !views' },
    { role: 'operateur', resource: 'Association', action: 'delete:any', attributes: '*' },

    { role: 'visiteur', resource: 'Association', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Association', action: 'read:any', attributes: '*' },
    { role: 'visiteur', resource: 'Association', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Association', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/


    /* ******************* 
    PERMISSIONS TYPES D'EQUIPEMENT
    ******************** */
    { role: 'admin', resource: 'Type_Equipement', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Type_Equipement', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Type_Equipement', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Type_Equipement', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Type_Equipement', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Type_Equipement', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Type_Equipement', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Type_Equipement', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Type_Equipement', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Type_Equipement', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Type_Equipement', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Type_Equipement', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/


    /* ******************* 
    PERMISSIONS CARACTERISTIQUES
    ******************** */
    { role: 'admin', resource: 'Caracteristiques', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Caracteristiques', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Caracteristiques', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Caracteristiques', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Caracteristiques', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Caracteristiques', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Caracteristiques', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Caracteristiques', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Caracteristiques', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Caracteristiques', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Caracteristiques', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Caracteristiques', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

    /* ******************* 
    PERMISSIONS MODELES
    ******************** */
    { role: 'admin', resource: 'ModeleEquipement', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'ModeleEquipement', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'ModeleEquipement', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'ModeleEquipement', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'ModeleEquipement', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'ModeleEquipement', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'ModeleEquipement', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'ModeleEquipement', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'ModeleEquipement', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'ModeleEquipement', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'ModeleEquipement', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'ModeleEquipement', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

    /* ******************* 
    PERMISSIONS Data equipement
    ******************** */
    { role: 'admin', resource: 'DataEquipement', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'DataEquipement', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'DataEquipement', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'DataEquipement', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'DataEquipement', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'DataEquipement', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'DataEquipement', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'DataEquipement', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'DataEquipement', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'DataEquipement', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'DataEquipement', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'DataEquipement', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

     /* ******************* 
    PERMISSIONS RECHERCHE
    ******************** */
    { role: 'admin', resource: 'Recherche', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Recherche', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Recherche', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Recherche', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Recherche', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Recherche', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Recherche', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Recherche', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Recherche', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Recherche', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Recherche', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Recherche', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

         /* ******************* 
    PERMISSIONS RECHERCHE
    ******************** */
    { role: 'admin', resource: 'Logs', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Logs', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Logs', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Logs', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Logs', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Logs', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Logs', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Logs', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Logs', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Logs', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Logs', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Logs', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

    { role: 'admin', resource: 'Export', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Export', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Export', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Export', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Export', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Export', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Export', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Export', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Export', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Export', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Export', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Export', action: 'delete:own', attributes: '*' },

        /* ******************* 
    PERMISSIONS TYPES D'USAGE
    ******************** */
    { role: 'admin', resource: 'Type_Usage', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Type_Usage', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Type_Usage', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Type_Usage', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Type_Usage', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Type_Usage', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Type_Usage', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Type_Usage', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Type_Usage', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Type_Usage', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Type_Usage', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Type_Usage', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/

            /* ******************* 
    PERMISSIONS USAGE
    ******************** */
    { role: 'admin', resource: 'Usage', action: 'create:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Usage', action: 'read:any', attributes: '*' },
    { role: 'admin', resource: 'Usage', action: 'update:any', attributes: '*, !views' },
    { role: 'admin', resource: 'Usage', action: 'delete:any', attributes: '*' },

    { role: 'operateur', resource: 'Usage', action: 'create:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Usage', action: 'read:own', attributes: '*' },
    { role: 'operateur', resource: 'Usage', action: 'update:own', attributes: '*, !views' },
    { role: 'operateur', resource: 'Usage', action: 'delete:own', attributes: '*' },

    { role: 'visiteur', resource: 'Usage', action: 'create:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Usage', action: 'read:own', attributes: '*' },
    { role: 'visiteur', resource: 'Usage', action: 'update:own', attributes: '*, !rating, !views' },
    { role: 'visiteur', resource: 'Usage', action: 'delete:own', attributes: '*' },
    /***********************************************************************************************/
];

module.exports = grantList;