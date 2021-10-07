import axios, { AxiosResponse } from "axios";

interface UsernameRequestType {
  deviceType: string;
}

type UsernameResponseType = [
  {
    success: {
      username: string;
    };
  }
];

type HttpMethod = "GET" | "POST";

export class HueClient {
  constructor(private ip: string, private username?: string) {}

  private async makeRequest<T, R>(method: HttpMethod, path: string, body?: T) {
    const { data } = await axios.request<T, AxiosResponse<R>>({
      method,
      url: `http://${this.ip}/api${path}`,
      data: body
    });

    return data;
  }

  private async makeAuthenticatedRequest<T = never, R = never>(
    method: HttpMethod,
    path: string,
    body?: T
  ) {
    if (!this.username) {
      const [
        {
          success: { username }
        }
      ] = await this.makeRequest<UsernameRequestType, UsernameResponseType>(
        "POST",
        "",
        {
          deviceType: "hue-build-status"
        }
      );

      this.username = username;
    }
    return await this.makeRequest<T, R>(
      method,
      `/${this.username}${path}`,
      body
    );
  }

  async get(path: string) {
    return await this.makeAuthenticatedRequest("GET", path);
  }
}
