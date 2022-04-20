import { LinksFunction, NavLink, Outlet } from "remix";
import { links as tabsLinks, Tabs } from "~/components/Tabs";
import * as Text from "~/components/text";

export let links: LinksFunction = function () {
    return [...Text.links(), ...tabsLinks()];
};

export default function UsersRoute() {
    return (
        <div>
            <Text.Heading level="h1">Users</Text.Heading>
            <Tabs>
                <NavLink to="./list">All</NavLink>
                <NavLink to="./invite">Invite</NavLink>
            </Tabs>

            <Outlet></Outlet>
        </div>
    );
}
