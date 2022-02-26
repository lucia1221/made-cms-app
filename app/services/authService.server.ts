import { User } from "~/models/user";
import { getUserLoginSchema } from "~/utils/validationSchemas";
import { databaseService } from "./databaseService";

export async function authenticateUser(email: string, password: string) {
  let schema = getUserLoginSchema();

  await schema.validate(
    { email: email, password: password },
    { abortEarly: false },
  );

  let user = await databaseService()
    .from<User>("users")
    .select("id, firstName, lastName, email")
    .match({ email: email, password: password })
    .single();

  console.log(user);
}
