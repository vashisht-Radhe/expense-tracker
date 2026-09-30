import { PanelLeft, UserCircle } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-border-light bg-surface px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="grid h-9 w-9 place-items-center rounded-md text-text-secondary transition-colors hover:bg-background hover:text-heading"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold text-heading">FinTrack</h1>
      </div>

      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
      >
        <UserCircle size={22} />

        <span className="text-sm font-medium">Profile</span>
      </button>
    </header>
  );
};

export default Header;
