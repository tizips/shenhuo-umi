declare namespace APIBasicLogin {

  type Request = {
    username?: string;
    password?: string;
  }

  type Response = {
    session_id: string;
    access_token: string;
    refresh_token: string;
    issued_at: number;
    access_lifetime: number;
    refresh_lifetime: number;
    grace_lifetime?: number;
  }

  type Former = {
    username?: string;
    password?: string;
  }

  type Result = {
    result?: "success" | "error";
    message?: string;
  }

}
