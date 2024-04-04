import axios from "axios";

const serverPath = "https://geocode.maps.co/search?q=";
export async function getLatLon(
  ort: string | null = "Karlsruhe",
  plz: string | null = "76133",
  strasse: string | null = "Amalienbadstr.",
  hausNr: string | null = "41"
) {
  let path = serverPath + hausNr + "+" + strasse + "+" + ort + "+" + plz;

  let result = await axios
    .get(path)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });

  return result;
}
