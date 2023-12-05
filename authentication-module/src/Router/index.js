import { Route, Routes } from "react-router-dom";
import { pageRoutes } from "./routes";

function RoutesWrapper() {
  return (
    <Routes>
      {pageRoutes.map((item,index) =>  <Route key={index} path={item.path} element={<item.Component />} />
      )}
    </Routes>
  );
}

export default RoutesWrapper;
