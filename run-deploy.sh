# Build the docker images for all services
cd postgres-db && docker build -f Dockerfile  -t image-intellisense/postgres-db . && cd ../;
cd redis-db && docker build -f Dockerfile  -t image-intellisense/redis-db . && cd ../;
cd qdrant-db && docker build -f Dockerfile  -t image-intellisense/qdrant-db . && cd ../;
cd ml-service && docker build -f Dockerfile  -t image-intellisense/ml-service . && cd ../;
cd upload-service && docker build -f Dockerfile  -t image-intellisense/upload-service . && cd ../;
cd gateway-service && docker build -f Dockerfile  -t image-intellisense/gateway-service . && cd ../;
cd frontend-service && docker build -f Dockerfile  -t image-intellisense/frontend-service . && cd ../;
cd content-retrival-service && docker build -f Dockerfile  -t image-intellisense/content-retrival-service . && cd ../;

# Create a namespace for image-intellisense
kubectl apply -f deploy/namespace.yaml;

# Deploy all database services
kubectl apply -f deploy/postgres-db.yaml;
kubectl apply -f deploy/qdrant-db.yaml;
kubectl apply -f deploy/redis-db.yaml;

# Deploy all backend services
kubectl apply -f deploy/ml-service.yaml;
kubectl apply -f deploy/upload-service.yaml;
kubectl apply -f deploy/gateway-service.yaml;
kubectl apply -f deploy/content-retrival-service.yaml;

# Deploy frontend service
kubectl apply -f deploy/frontend-service.yaml;
