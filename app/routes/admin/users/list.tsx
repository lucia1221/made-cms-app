import {
    json,
    LinksFunction,
    LoaderFunction,
    NavLink,
    Outlet,
    useLoaderData,
} from "remix";
import { Avatar, links as avatarLinks } from "~/components/avatar";
import { User } from "~/models/user";
import { databaseService } from "~/services/databaseService.server";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./list.css") },
        ...avatarLinks(),
    ];
};

export default function UsersListRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div className="user-list-layout">
            <div className="user-list">
                {data.users.map(function (user) {
                    let fullName = `${user.firstName} ${user.lastName}`;
                    return (
                        <NavLink key={user.id} to={`./${user.id}`}>
                            <Avatar size={32} alt={fullName} />
                            <div>
                                <span className="name">{fullName}</span>
                                <br></br>
                                <span className="email">{user.email}</span>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
            <Outlet></Outlet>
        </div>
    );
}

interface LoaderData {
    users: User[];
}

export { CatchBoundary } from "~/components/CatchBoundary";

export let loader: LoaderFunction = async function (): Promise<LoaderData> {
    let response = await databaseService().from<User>("users").select();

    if (response.error) {
        throw json(response.error, response);
    }

    return {
        users: response.data,
    };
};
