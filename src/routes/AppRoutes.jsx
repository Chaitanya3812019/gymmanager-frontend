import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Members from "../pages/Members";
import MemberDetails from "../pages/MemberDetails";
import AddMember from "../pages/AddMember";
import EditMember from "../pages/EditMember";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Favorites from "../pages/Favorites";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />

      <Route path="/members/:id" element={<MemberDetails />} />
      <Route path="/add-member" element={<AddMember />} />
      <Route path="/edit-member/:id" element={<EditMember />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default AppRoutes;