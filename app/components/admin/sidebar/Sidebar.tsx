import cx from "classnames";
import { Book, LogOut, Settings, Users } from "react-feather";
import { Link, LinksFunction, NavLink } from "remix";
import { Avatar, links as avatarLinks } from "~/components/avatar";
import { Logo } from "~/components/logo";
import { useSessionData } from "~/hooks/useSessionData";
import { AUTH_ROUTES } from "~/routes/admin";

export let links: LinksFunction = function () {
    return [...avatarLinks()];
};

export let Sidebar: React.FC = function () {
    let sessionData = useSessionData()!;
    let fullName = `${sessionData.firstName} ${sessionData.lastName}`;
    return (
        <>
            <div className="sidebar-header">
                <Logo height={32}></Logo>
            </div>
            <div className="sidebar-main">
                <NavLink to="/admin/articles">
                    <Book /> <span>articles</span>
                </NavLink>
                <NavLink to="/admin/users/list">
                    <Users />
                    <span>users</span>
                </NavLink>
            </div>
            <div className="sidebar-footer">
                <Avatar
                    size={40}
                    alt={fullName}
                    imageUrl={sessionData.avatar}
                />

                <span className="profile-name">{fullName}</span>

                <Link
                    to="/admin/profile/settings"
                    style={{ marginLeft: "auto" }}
                >
                    <Settings size={16} />
                </Link>
                <Link to={AUTH_ROUTES.logout} reloadDocument>
                    <LogOut size={16} />
                </Link>
            </div>
        </>
    );
};
