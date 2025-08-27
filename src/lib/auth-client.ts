import { client } from "./trpc-client";

export const fetchSession = () => client.auth.getSession.query();