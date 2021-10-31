import { GenericContainer } from "testcontainers";

export const buildImage = () => GenericContainer.fromDockerfile(".").build();
