import { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth.server";


export let loader: LoaderFunction = function({request}){
  
  return authenticator.logout(request, {redirectTo: "/login"})
    
}

