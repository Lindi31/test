import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Locateable } from "../../model/Location";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import {
  buttonStyle,
  cardStyleInner,
  headerStyle,
} from "../../components/Layout/tailwindStyles";
import dummyOSM from "../../assets/img/dummyOSM.png";

export default function LocationDetails({
  location,
}: {
  location: Locateable;
}) {
  const pStyle = "mb-2 font-normal text-gray-700 dark:text-gray-400";

  const ort = location["ort"] ? location["ort"] : "";

  const gooleMapsLink =
    "http://www.google.de/maps/?q=%20" +
    location["strasse"] +
    ",%20" +
    location["plz"] +
    ",%20" +
    ort;
  return (
    <>
      <div className={cardStyleInner}>
        <a href="#">
          <img className="rounded-t-lg" src={dummyOSM} alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className={headerStyle}>Address</h5>
          </a>
          <p className={pStyle}>{location["strasse"]}</p>
          <p className={pStyle}>{location["plz"] + " " + ort}</p>
          <a href={gooleMapsLink} className={buttonStyle}>
            navigate
            <FontAwesomeIcon icon={faMap} className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </>
  );
}
