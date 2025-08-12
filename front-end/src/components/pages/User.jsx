import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify"; // ✅ Make sure toast is imported

function UserProfile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
  });

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email || "");
      } catch (err) {
        console.error("Failed to decode token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchWithAuth("https://rivoz.in/api/user/user-profile/");
        const data = await response.json();

        if (response.ok && data) {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            company_name: data.company_name || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
          });
        } else {
          console.warn("User data not found or failed to fetch.");
          toast.error("Failed to load user profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchWithAuth("https://rivoz.in/api/user/update-profile/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Profile updated successfully!");
      } else {
        toast.error(`❌ Failed: ${data?.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error occurred while updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 hover:shadow-xl transition-all duration-500">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input name="first_name" type="text" placeholder="First Name" value={formData.first_name} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
          <input name="last_name" type="text" placeholder="Last Name" value={formData.last_name} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
        </div>

        <div className="flex gap-4">
          <input name="phone_number" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
          <input name="company_name" type="text" placeholder="Company Name" value={formData.company_name} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
        </div>

        <div className="flex gap-4">
          <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
          <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange}
            className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />
        </div>

        <input name="state" type="text" placeholder="State" value={formData.state} onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400" />

        <div>
          <label className="block font-semibold mb-1">My Email Address</label>
          <p className="text-gray-400">{email || "No email found in token"}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold mt-2 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
