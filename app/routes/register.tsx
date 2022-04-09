import { Heading, Paragraph } from "evergreen-ui";
import {
    Form,
    Link,
    LinksFunction,
    useActionData,
    useSearchParams,
    useTransition,
} from "remix";
import { TextInput } from "~/components";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { RequestContext } from "~/components/context";
import { AuthController } from "~/controllers/admin/AuthController";
import { RequestResponse } from "~/models/RequestResponse";
import { ActionDataFunction } from "~/utils/remix";
import { AUTH_ROUTES } from "./admin";
import routeStyle from "./register.css";
import { Button, links as buttonLinks } from "~/components/button";
import {
    ButtonGroup,
    links as buttonGroupLinks,
} from "~/components/buttonGroup";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: routeStyle },
        ...buttonGroupLinks(),
        ...buttonLinks(),
    ];
};

export let action: ActionDataFunction = async function (args) {
    const controller = new AuthController();

    return controller.registerUser(args);
};

export const CatchBoundary = createFormValidationCatchBoundary(RegisterRoute);

export default function RegisterRoute() {
    let [searchParams] = useSearchParams();
    let actionData = useActionData<RequestResponse>();
    let transition = useTransition();

    return (
        <RequestContext.Provider value={{ error: actionData?.error }}>
            <Form method="post" className="register-user">
                <Heading size={700}>Welcome to the team</Heading>
                <Paragraph>
                    All invited people will be granted access to all sites
                    within your organisation
                </Paragraph>
                <Paragraph>Already A Member?</Paragraph>
                <Link to={AUTH_ROUTES.login}>Log In</Link>
                <fieldset
                    disabled={
                        transition.state === "submitting" || !!actionData?.data
                    }
                >
                    <TextInput
                        name="firstName"
                        label="First name"
                        defaultValue={transition.submission?.formData.get(
                            "firstName",
                        )}
                    />
                    <TextInput
                        name="lastName"
                        label="Last name"
                        defaultValue={transition.submission?.formData.get(
                            "lastName",
                        )}
                    />
                    <TextInput
                        name="email"
                        label="E-mail"
                        autoComplete="username"
                        defaultValue={
                            searchParams.get("email") ??
                            transition.submission?.formData.get("email")
                        }
                    />
                    <TextInput
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                    />
                    <TextInput
                        type="hidden"
                        name="token"
                        defaultValue={
                            searchParams.get("token") ??
                            transition.submission?.formData.get("token")
                        }
                    />
                    <ButtonGroup alignChildren="end">
                        <Button appearance="primary">Register</Button>
                    </ButtonGroup>
                </fieldset>
            </Form>
        </RequestContext.Provider>
    );
}
