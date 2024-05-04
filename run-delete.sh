# Delete all database services
kubectl delete -f deploy/postgres-db.yaml;
kubectl delete -f deploy/qdrant-db.yaml;
kubectl delete -f deploy/redis-db.yaml;

# Delete all backend services
kubectl delete -f deploy/upload-service.yaml;
kubectl delete -f deploy/content-retrival-service.yaml;
kubectl delete -f deploy/gateway-service.yaml;
kubectl delete -f deploy/ml-service.yaml;

# Delete frontend service
kubectl delete -f deploy/frontend-service.yaml;

# Delete namespace for image-intellisense
kubectl delete -f deploy/namespace.yaml;
