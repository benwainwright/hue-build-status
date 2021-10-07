import { HueClient } from "./client";

const settings = {
  discoverIp: () => "192.168.1.102"
};

export const run = async () => {
  const client = new HueClient(settings.discoverIp());

  const response = await client.get("/lights");

  console.log(response);
};
