import { Button, Heading, Paragraph } from "evergreen-ui";
import { Form, json, LinksFunction, redirect, useSearchParams } from "remix";
import { ValidationError } from "yup";
import { TextInput } from "~/components";
import { passwordResetEmail } from "~/services/authService.server";
import { UserRegistrationData, UserResetPasswordData } from "~/services/userService";
import { ActionDataFunction } from "~/utils/remix";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { AuthController } from "~/controllers/admin/AuthController";

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./admin.auth.password-reset.css") }];
  };

export let action: ActionDataFunction = async function (args) {
  let controller = new AuthController()
  return controller.requestPasswordResetEmail(args)
    
     
    };

  export const CatchBoundary = createFormValidationCatchBoundary(ForgotPasswordRoute);

  export default function ForgotPasswordRoute() {

    let [searchParams] = useSearchParams();

    
    return (
      <Form method="post" className="reset-form">
        <Heading size={700}>Password reset</Heading>
        <Paragraph>Send a link to your email to reset your password.</Paragraph>
        <TextInput
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
        />
        <input
          name="token"
          defaultValue={searchParams.get("token") ?? ""}
          type="hidden"
        />
        <Button>Reset password</Button>
      </Form>
    );
  }

