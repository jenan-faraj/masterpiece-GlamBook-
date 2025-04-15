import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include", // مهم لإرسال الكوكي
    })
      .then(() => navigate("/"))
      .catch((err) => {
        console.error("Logout error:", err);
        navigate("/login");
      });
  }, [navigate]);

  return <div className="text-center">Logging out...</div>;
}

export default Logout;
