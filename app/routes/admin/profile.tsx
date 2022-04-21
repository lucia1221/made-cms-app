import { LinksFunction, NavLink, Outlet } from "remix";
import { links as tabsLinks, Tabs } from "~/components/Tabs";
import * as Text from "~/components/text";

export let links: LinksFunction = function () {
    return [...Text.links(), ...tabsLinks()];
};

export default function MyProfileRoute() {
    return (
        <div>
            <Text.Heading level="h1">My profile</Text.Heading>
            <Tabs>
                <NavLink to="./settings">Settings</NavLink>
                <NavLink to="./my-articles">My articles</NavLink>
            </Tabs>

            <Outlet></Outlet>
        </div>
    );
}
