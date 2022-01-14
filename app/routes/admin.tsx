import { LinksFunction, Outlet } from "remix";
import styles from "~/styles/admin.css"

export const links: LinksFunction= function(){

    return [
        {rel:"stylesheet", href:styles},
        {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
            crossOrigin: "anonymous",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
          },
      

    ]
}

export default function AdminRoute(){
    return <div className="container">
  <div className="sidebar">sidebar</div>
  <div className="main"><Outlet></Outlet></div>
</div>
}