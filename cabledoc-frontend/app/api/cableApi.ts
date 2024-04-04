import { apiGetCall } from "./axios"; // Adjust path if necessary
import { User } from "./user"; // Adjust path if necessary

// Funktion zum Abrufen aller Kabel
export const fetchCables = async (user: User) => {
  const path = `${process.env.NEXT_PUBLIC_API_URL}Cable`;
  try {
    const data = await apiGetCall(user, path);
    return data;
  } catch (error) {
    console.error("Error fetching cables:", error);
    throw new Error("Failed to fetch cables");
  }
};
export const fetchLocations = async (user: User) => {
  const path = `${process.env.NEXT_PUBLIC_API_URL}Standort`;
  try {
    const data = await apiGetCall(user, path);
    return data;
  } catch (error) {
    console.error("Error fetching cables:", error);
    throw new Error("Failed to fetch cables");
  }
};
