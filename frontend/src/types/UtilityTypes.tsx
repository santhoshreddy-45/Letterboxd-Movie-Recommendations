export type MultiUsernameValidation =
    | {
          status: "success";
          usernames: string[];
      }
    | {
          status: "error";
          message: string;
      };

export type SingleUsernameValidation =
    | {
          status: "success";
          username: string;
      }
    | {
          status: "error";
          message: string;
      };
