import { Form, LinksFunction, useActionData, useTransition } from "remix";
import { InputGroup } from "~/components";
import { Alert, links as alertLinks } from "~/components/alert";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { RequestContext } from "~/components/context";
import { AuthController } from "~/controllers/admin/AuthController";
import { RequestResponse } from "~/models/RequestResponse";
import { TransactionalEmail } from "~/models/transactionalEmail";
import { ActionDataFunctionNext } from "~/utils/remix";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./users.invite.css") },
        ...alertLinks(),
    ];
};

export let action: ActionDataFunctionNext<TransactionalEmail> = async function (
    args,
) {
    let controller = new AuthController();

    return controller.inviteUser(args);
};

export let CatchBoundary = createFormValidationCatchBoundary(UserInvite);

export default function UserInvite() {
    let transition = useTransition();
    let actionData = useActionData<RequestResponse<TransactionalEmail>>();

    return (
        <RequestContext.Provider value={{ error: actionData?.error }}>
            <Form method="post" className="invitation-form">
                <div className="inv-text">
                    <span>Invite people</span>
                </div>
                <div>
                    <p className="subtitle">
                        All invited people will be granted access to all sites
                        within your organisation.
                    </p>
                </div>
                <span>Add to Team</span>

                <fieldset
                    className="invitation-form-elements"
                    disabled={!!actionData?.data || transition.state !== "idle"}
                >
                    <InputGroup name="email">
                        <input
                            name="email"
                            type="text"
                            placeholder="Invite user by email"
                        />
                    </InputGroup>
                    <button type="submit">
                        {transition.state === "submitting" ? "Sending" : "Send"}{" "}
                        invitation
                    </button>
                </fieldset>
                {actionData?.data ? (
                    <Alert type="success" style={{ marginTop: 20 }}>
                        Invitation sent successfully.
                    </Alert>
                ) : null}
            </Form>
        </RequestContext.Provider>
    );
}
