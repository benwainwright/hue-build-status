import axios, { AxiosResponse } from "axios";

export const DEVICE_TYPE = "hue-build-status";

interface UsernameRequestType {
  devicetype: string;
}

type HueErrorType = [
  {
    error: { type: number; address: string; description: string };
  }
];

type UsernameResponseType = [
  {
    success: {
      username: string;
    };
  }
];

const isError = (response: unknown[]): response is HueErrorType =>
  Array.isArray(response) && Object.hasOwnProperty.call(response[0], "error");

type HttpMethod = "GET" | "POST";

export class HueClient {
  constructor(private ip: string, private username?: string) {}

  private async makeRequest<T, R>(method: HttpMethod, path: string, body?: T) {
    const { data } = await axios.request<T, AxiosResponse<R>>({
      method,
      url: `http://${this.ip}/api${path}`,
      data: body
    });

    console.log(data);

    return data;
  }

  public async getUsername() {
    if (!this.username) {
      const response = await this.makeRequest<
        UsernameRequestType,
        UsernameResponseType | HueErrorType
      >("POST", "", {
        devicetype: DEVICE_TYPE
      });

      if (isError(response)) {
        const [
          {
            error: { type, address, description }
          }
        ] = response;

        const addressString = address ? `:${address}` : ``;

        throw new Error(`Error[${type}${addressString}]: ${description}`);
      }

      const [
        {
          success: { username }
        }
      ] = response;

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
