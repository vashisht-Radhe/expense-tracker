import { MoveLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = ({ closeProfile }) => {
  const { user } = useAuth();

  return (
    <div className="modal-overlay">
      <div className="bg-white w-full max-w-3xl shadow-md content rounded-2xl">
        <button onClick={closeProfile} className="flex items-center gap-3 ">
          <MoveLeft size={12} />
          Back to home
        </button>

        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Profile;
