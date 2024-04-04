import { SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { cardStyleInner } from "../../components/Layout/tailwindStyles";
import {
  Locateable,
  editLocateable,
  getLocation,
  locationSchema,
} from "../../model/Location";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLatLon } from "../../ressources/geocoding";
import {
  Params,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { axiosErrorHandler } from "../../../app/api/axios";
import { User } from "../../../app/api/user";
import { isSuccess } from "../../ressources/functions";

type FormValues = z.infer<typeof locationSchema>;

/**
 *
 * @todo handle Dropdown Menu Change!!!!!
 */
export default function EditLocation() {
  const navigate = useNavigate();
  const params = useParams<Params>();
  if (!params.id) {
    throw new Error("Parameter kann nich gelesen werden");
  }
  const id = parseInt(params.id);
  const user: User = useOutletContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Locateable | null>(null);
  const [selectedOption, setSelectedOption] = useState("Standort");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocation(user, id, false);
        if (!active) {
          return;
        }
        setLocation(locations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    let active = true;
    fetchLocations();
    return () => {
      active = false;
    };
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    //manipulate data
    /**@todo  why is data.lon and data.lat field null ??????? */
    if (location?.lat) {
      data.lat = location?.lat;
    }
    if (location?.lon) {
      data.lon = location?.lon;
    }
    data.id = location?.id as number;
    data.version = location?.version;

    let result = await editLocateable(user, data as Locateable);
    if (result.type === "success" && isSuccess(result)) {
      toast.success("Changes successfully transfered to Backend!");
      navigate("/location/" + result.data.id);
    } else {
      if (isSuccess(result)) {
        let message = axiosErrorHandler(result.data[0].error);
        toast.error("Fehler bei der Änderung: " + message);
      }
    }

    // try {
    // let result = await editLocateable(user, data);
    //   if (result) {
    //     navigate("/location/" + result.id);
    //     toast.success("Changes successfully transfered to Backend!");
    //   } else {
    //     toast.error("There was an error while transferring the form data");
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   toast.error(axiosErrorHandler(error as any));
    //   setLoading(false);
    // }
  };

  const handleKlasseChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedOption(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocation((prevData) => ({ ...prevData, [name]: value }));
  };

  const calculateLatLon = async () => {
    setLoading(true);

    let latlon = await getLatLon(
      location?.ort,
      location?.plz,
      location?.strasse,
      location?.hausNr
    );
    setLoading(false);

    setLocation((prevData) => ({ ...prevData, ["lat"]: latlon[0]["lat"] }));
    setLocation((prevData) => ({ ...prevData, ["lon"]: latlon[0]["lon"] }));
  };

  type LocationTypes = {
    Standort: string[];
    SubStandort: string[];
    TerminationContainer: string[];
  };

  // const location_types = ["Standort", "SubStandort", "TerminationContainer"];
  const standort_types = ["POP", "HVT", "TXX", "END", "SCHACHT", "IPC", "KVZ"];
  const sub_standort_types = [
    "GEBAEUDE",
    "STOCKWERK",
    "RAUM",
    "KAEFIG",
    "SONSTIGES",
  ];
  const termination_types = [
    "Muffe",
    "PatchMuffe",
    "DoubleRack",
    "RackFront",
    "RackBack",
    "SingleRack",
    "Patchfeld",
    "SONSTIGES",
  ];
  const location_types: LocationTypes = {
    Standort: standort_types,
    SubStandort: sub_standort_types,
    TerminationContainer: termination_types,
  };

  let options: string[] | undefined =
    location_types[selectedOption as keyof LocationTypes];

  const layout = "p-3 text-left";
  const labelLayout =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
  const inputLayout =
    "appearance-none block rounded w-full py-2 px-4 bg-gray-200 text-gray-700 border border-gray-200 focus:border-gray-500 leading-tight focus:outline-none focus:bg-white";
  const selectLaypout =
    "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

  const columnLayout = "flex flex-wrap -mx-3 mb-5";
  const errorFieldLayout = "text-red-500 text-sm";

  return (
    <>
      {location && (
        <div className={layout + " " + cardStyleInner + " max-w-2xl"}>
          <h1 className="text-2xl font-bold mb-4">Standort bearbeiten</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
            {loading && <div className="mb-4 text-3xl">Loading...</div>}
            {/* =====NAME / TYPE==== */}
            <div className={columnLayout}>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className={labelLayout} htmlFor="grid-name">
                  Name
                </label>
                <input
                  {...register("name")}
                  className={inputLayout + " mb-3"}
                  id="grid-name"
                  type="text"
                  placeholder=""
                  value={location.name ?? ""}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className={errorFieldLayout}>
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className={labelLayout} htmlFor="grid-class">
                  Klasse
                </label>
                <div className="relative">
                  <select
                    {...register("className")}
                    className={selectLaypout}
                    id="grid-class"
                    onChange={handleKlasseChange}
                  >
                    {Object.keys(location_types).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FontAwesomeIcon icon={faCaretDown} className="ml-4" />
                  </div>
                </div>
                {errors.className?.message && (
                  <span className={errorFieldLayout}>
                    {errors.className.message}
                  </span>
                )}
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className={labelLayout} htmlFor="grid-type">
                  Standorttyp
                </label>
                <div className="relative">
                  <select
                    {...register("type")}
                    className={selectLaypout}
                    id="grid-type"
                  >
                    {options.map((type, index) => (
                      <option key={index} value={index}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FontAwesomeIcon icon={faCaretDown} className="ml-4" />
                  </div>
                </div>
                {errors.type?.message && (
                  <span className={errorFieldLayout}>
                    {errors.type.message}
                  </span>
                )}
              </div>
            </div>
            {/* =====COMMENT==== */}
            <div className={columnLayout}>
              <div className="w-full md:w-1/2 px-3">
                <label htmlFor="comment" className={labelLayout}>
                  Kommentar
                </label>
                <textarea
                  className={inputLayout + " mb-3"}
                  {...register("comment")}
                  id="comment"
                  rows={3}
                  placeholder="Your Comment"
                  value={location.comment ?? ""}
                  onChange={handleChange}
                ></textarea>
                {errors.comment && (
                  <span className={errorFieldLayout}>
                    {errors.comment.message}
                  </span>
                )}
              </div>
              {selectedOption !== "Standort" && (
                <div className="w-full md:w-1/2 px-3">
                  <label className={labelLayout} htmlFor="grid-parentId">
                    Parent ID
                  </label>
                  <input
                    {...register("parentId")}
                    className={inputLayout + " mb-3"}
                    id="grid-parentId"
                    type="text"
                    placeholder=""
                    value={location.parentId ?? ""}
                    onChange={handleChange}
                  />
                  {errors.parentId && (
                    <span className={errorFieldLayout}>
                      {errors.parentId.message}
                    </span>
                  )}
                </div>
              )}
            </div>
            {selectedOption === "Standort" && (
              <div>
                {/* ====ORT / PLZ===== */}
                <div className={columnLayout}>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className={labelLayout} htmlFor="grid-ort">
                      ORT
                    </label>
                    <input
                      {...register("ort")}
                      className={inputLayout + " mb-3"}
                      id="grid-ort"
                      type="text"
                      placeholder=""
                      value={location.ort ?? ""}
                      onChange={handleChange}
                    />
                    {errors.ort && (
                      <span className={errorFieldLayout}>
                        {errors.ort.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className={labelLayout} htmlFor="grid-plz">
                      PLZ
                    </label>
                    <input
                      {...register("plz")}
                      className={inputLayout + " mb-3"}
                      id="grid-plz"
                      type="text"
                      placeholder=""
                      value={location.plz ?? ""}
                      onChange={handleChange}
                    />
                    {errors.plz && (
                      <span className={errorFieldLayout}>
                        {errors.plz.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* ====STRASSE / HAUS NR===== */}
                <div className={columnLayout}>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className={labelLayout} htmlFor="grid-strasse">
                      Strasse
                    </label>
                    <input
                      {...register("strasse")}
                      className={inputLayout + " mb-3"}
                      id="grid-strasse"
                      type="text"
                      placeholder=""
                      value={location.strasse ?? ""}
                      onChange={handleChange}
                    />
                    {errors.strasse && (
                      <span className={errorFieldLayout}>
                        {errors.strasse.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className={labelLayout} htmlFor="grid-hausNr">
                      HausNr.
                    </label>
                    <input
                      {...register("hausNr")}
                      className={inputLayout + " mb-3"}
                      id="grid-hausNr"
                      type="text"
                      placeholder=""
                      value={location.hausNr ?? ""}
                      onChange={handleChange}
                    />
                    {errors.hausNr && (
                      <span className={errorFieldLayout}>
                        {errors.hausNr.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* ====LAT / LON ==== */}
                <div className={columnLayout}>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className={labelLayout} htmlFor="grid-lat">
                      Latitude
                    </label>
                    <input
                      {...register("lat")}
                      className={inputLayout + " mb-3"}
                      id="grid-lat"
                      type="number"
                      placeholder=""
                      value={location.lat ?? ""}
                      onChange={handleChange}
                    />
                    {errors.lat && (
                      <span className={errorFieldLayout}>
                        {errors.lat.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className={labelLayout} htmlFor="grid-lon">
                      Longitude
                    </label>
                    <input
                      {...register("lon")}
                      className={inputLayout + " mb-3"}
                      id="grid-lon"
                      type="text"
                      placeholder=""
                      value={location.lon ?? ""}
                      onChange={handleChange}
                    />
                    {errors.lon && (
                      <span className={errorFieldLayout}>
                        {errors.lon.message}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={
                      " mx-3 px-1 py-1 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
                    }
                    onClick={calculateLatLon}
                  >
                    Recalculate Lat Lon
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded shadow-md hover:bg-emerald-600 focus:outline-none"
            >
              Send
            </button>
          </form>
          <Toaster
            position="top-center"
            gutter={24}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      )}
    </>
  );
}
