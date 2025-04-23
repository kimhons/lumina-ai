FROM openjdk:17-slim

WORKDIR /app

COPY target/workflow-service-1.0.0.jar workflow-service.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "workflow-service.jar"]
