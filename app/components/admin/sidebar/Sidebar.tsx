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
                <Logo height={24}></Logo>
            </div>
            <div className="sidebar-main">
                <NavLink to="/admin/articles" className={getClassName}>
                    <Book /> <span>articles</span>
                </NavLink>
                <NavLink to="/admin/users/list" className={getClassName}>
                    <Users />
                    <span>users</span>
                </NavLink>
            </div>
            <div className="sidebar-footer">
                <Avatar size={40} alt={fullName} />

                <span className="profile-name">{fullName}</span>

                <Link to="/admin/profile" style={{ marginLeft: "auto" }}>
                    <Settings size={16} />
                </Link>
                <Link to={AUTH_ROUTES.logout} reloadDocument>
                    <LogOut size={16} />
                </Link>
            </div>
        </>
    );
};

function getClassName(props: { isActive: boolean }): string {
    return cx("block-link", { "block-link-active": props.isActive });
}
