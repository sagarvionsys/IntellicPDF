import axios from "axios";

const useGetUserCountry = async () => {
  try {
    const res = await axios.get("http://ip-api.com/json/");
    return res.data.countryCode; // Example: "IN" for India, "AE" for UAE
  } catch (error) {
    console.error("Error fetching user country:", error);
    return "US"; // Default to US if there's an error
  }
};

export default useGetUserCountry;
