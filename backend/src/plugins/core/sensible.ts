import fp from "fastify-plugin";
import sensible from "@fastify/sensible";

export default fp(sensible, {
  name: "@fastify/sensible",
});