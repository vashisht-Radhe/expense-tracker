import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Profile from "../pages/Profile";

const AppLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(window.innerWidth >= 768);
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const openProfile = () => {
    setOpen(true);
  };

  const closeProfile = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenSidebar(false);
      } else {
        setOpenSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {openSidebar && (
        <Sidebar
          onClose={() => setOpenSidebar(false)}
          openProfile={openProfile}
        />
      )}
      {open && (
        <Profile onClose={() => setOpen(false)} closeProfile={closeProfile} />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
