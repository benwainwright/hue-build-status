import axios, { AxiosResponse } from "axios";

export const DEVICE_TYPE = "hue-build-status";

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

  public async getUsername() {
    if (!this.username) {
      const [
        {
          success: { username }
        }
      ] = await this.makeRequest<UsernameRequestType, UsernameResponseType>(
        "POST",
        "",
        {
          deviceType: DEVICE_TYPE
        }
      );

      this.username = username;
    }
    return this.username;
  }

  private async makeAuthenticatedRequest<T = never, R = never>(
    method: HttpMethod,
    path: string,
    body?: T
  ) {
    return await this.makeRequest<T, R>(
      method,
      `/${await this.getUsername()}${path}`,
      body
    );
  }

  async get<R>(path: string) {
    return await this.makeAuthenticatedRequest<R>("GET", path);
  }

  async post<T, R>(path: string, data: T) {
    return await this.makeAuthenticatedRequest<T, R>("POST", path, data);
  }
}
