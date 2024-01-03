import { Route, Routes } from "react-router-dom";
import { pageRoutes } from "./routes";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {routesPath} from "./routes.js";


function RoutesWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
		const x = () => {
			if (window.location.pathname.includes(routesPath.VERIFY)) {				
        navigate(routesPath.LOGIN);
			}
      else if (window.location.pathname.includes(routesPath.DASHBOARD)) {				
        navigate(routesPath.LOGIN);
			}
      else if (window.location.pathname.includes(routesPath.FORGOTPASSWORD)) {				
        navigate(routesPath.LOGIN);
			}
      else if (window.location.pathname.includes(routesPath.RESETPASSWORD)) {				
        navigate(routesPath.FORGOTPASSWORD);
			}
		};
		window.addEventListener("popstate", x);
		return () => {
			window.removeEventListener("popstate", x);
		};
	}, []);
  return (
    <Routes>
      {pageRoutes.map((item,index) =>  <Route key={index} path={item.path} element={<item.Component {...item.pageProp}/>} />
      )}
    </Routes>
  );
}

export default RoutesWrapper;
