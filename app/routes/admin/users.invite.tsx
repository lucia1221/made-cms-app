import {
  Form,
  json,
  LinksFunction,
  useActionData,
  useCatch,
  useTransition,
} from "remix";
import { ValidationError } from "yup";
import { InputGroup } from "~/components";
import { Alert, links as alertLinks } from "~/components/alert";
import { CatchBoundary as CommonCatchBoundary } from "~/components/CatchBoundary";
import { RequestContext } from "~/components/context";
import { inviteUser } from "~/services/userInvitationService.server";
import { ActionDataFunction, isValidationErrorResponse } from "~/utils/remix";
import routeStyle from "~/styles/users.invite.css";

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
          <input
            name="email"
            type="text"
            placeholder="Invite user by email"
          ></input>
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

export function CatchBoundary() {
  let caugth = useCatch();

  if (isValidationErrorResponse(caugth)) {
    return (
      <RequestContext.Provider value={{ validationError: caugth.data }}>
        <UserInvite />
      </RequestContext.Provider>
    );
  }

  return <CommonCatchBoundary />;
}
