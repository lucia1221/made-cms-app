import { User } from "@supabase/supabase-js";
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy<User>(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    if (email != "abc@gmail.com") {
      return Promise.reject(new AuthorizationError());
    }
    let user: User = {
      id: "aaaaaa",
      app_metadata: {},
      user_metadata: {},
      created_at: "bbbbb",
      aud: "aaaaaaaaaa",
    };

    return user;
  }),

  "user-pass",
);
