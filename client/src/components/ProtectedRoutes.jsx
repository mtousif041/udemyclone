// isme hum routes ko protect krenge yaani ki user admin ke routes ko access nhai kr shakta hai
// isme teen routes honge
//1= agr me login hu to dobara login pe nhai ja paunga
//2= agr me login hi nhai hu to me kisi bhi service ko access hi nhai kr shakta  sirf home page dhek shakta hai
//3= agr me normal user hu to dashboard ko  access nhai kr shakta

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//
export const ProtectedRoute = ({ children }) => {
  //to knyki iske ander hum component ko wrap krenege aur jis component ko wrap krenge  vo component hi hmaaare liye children ho jaayegaa
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children; //agr subkhuch shai hota hai to us component ko return kr dhenge
};

//means ki agr user login hai to wapas login pe nhai ja paayega
export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

/// ye wala admin ke liye hoga
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // ab agr authenticated ho gya aur uska role instructor hai hi nahi to
  if (user?.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};

// ab isko mere ko rap krna hai unse jo bhi mere components honge  App.jsx me , jin jin ko protect krna hai unko isme wrap kr dhenge
// like <AuthenticatedUser><Login /></AuthenticatedUser>
