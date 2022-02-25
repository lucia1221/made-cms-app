import { Form, json, LinksFunction, useActionData, useTransition } from "remix";
import { ValidationError } from "yup";
import { InputGroup } from "~/components";
import { Alert, links as alertLinks } from "~/components/alert";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { inviteUser } from "~/services/userService";
import routeStyle from "~/styles/admin.users.invite.css";
import { ActionDataFunction } from "~/utils/remix";
export { createFormValidationCatchBoundary } from "~/components/CatchBoundary";

interface ActionData {
  success: true;
}

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: routeStyle }, ...alertLinks()];
};

export let action: ActionDataFunction = async function ({ request }) {
  let form = await request.formData();

  try {
    await inviteUser(form.get<string>("email") ?? "");
  } catch (error) {
    if (error instanceof ValidationError) {
      throw json(error, { status: 422 });
    } else {
      throw error;
    }
  }

  return json({ success: true });
};

export let CatchBoundary = createFormValidationCatchBoundary(UserInvite);

export default function UserInvite() {
  let transition = useTransition();
  let actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="invitation-form">
      <div className="inv-text">
        <span>Invite people</span>
      </div>
      <div>
        <p className="subtitlee">
          All invited people will be granted access to all sites within your
          organisation
        </p>
      </div>
      <span>Add to Team</span>

      <fieldset
        className="invitation-form-elements"
        disabled={actionData?.success}
      >
        <InputGroup name="email">
          <input name="email" type="text" placeholder="Invite user by email" />
        </InputGroup>
        <button type="submit">
          {transition.state === "submitting" ? "Sending" : "Send"} invitation
        </button>
      </fieldset>
      {actionData?.success ? (
        <Alert type="success" style={{ marginTop: 20 }}>
          Invitation sent successfully.
        </Alert>
      ) : null}
    </Form>
  );
}
