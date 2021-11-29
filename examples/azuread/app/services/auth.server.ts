import { Auth0Strategy, Authenticator } from "remix-auth";
import { login, User } from "~/models/user";
import { sessionStorage } from "~/services/session.server";

export let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.AUTH0_CLIENT_ID) {
  throw new Error("Missing AUTH0_CLIENT_ID env");
}

if (!process.env.AUTH0_CLIENT_SECRET) {
  throw new Error("Missing AUTH0_CLIENT_SECRET env");
}

if (!process.env.AUTH0_DOMAIN) {
  throw new Error("Missing AUTH0_DOMAIN env");
}

authenticator.use(
  new Auth0Strategy(
    {
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/auth0/callback",
      domain: process.env.AUTH0_DOMAIN,
    },
    async (_, __, ___, profile) => login(profile.emails[0].value)
  )
);
