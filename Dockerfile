FROM docker.dsi-registry.univ-lr.fr/dsi-stable/dsi-deploy-base-vuejs:rootless@sha256:d223c03a3d643888108e399bdc7b796c2cd5d96b5d725d2e6c4592f175056ed0
# chown vers le uid du user specifié dans le conteneur de base
# car lors de l'execution une substitution de variables dans les fichiers a lieu
COPY --chown=1001 ./dist /app
