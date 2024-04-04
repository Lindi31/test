import React, { useState, useEffect } from "react";
import "./BundleConnect.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ColorCodes {
  [key: string]: string[];
}

const colorCodes: ColorCodes = {
  DIN: [
    "red",
    "green",
    "blue",
    "yellow",
    "white",
    "grey",
    "brown",
    "violet",
    "turquoise",
    "black",
    "orange",
    "pink",
  ],
  Bellcore: [
    "blue",
    "orange",
    "green",
    "brown",
    "grey",
    "white",
    "red",
    "black",
    "yellow",
    "violet",
    "pink",
    "turquoise",
  ],
  COLT: [
    "blue",
    "orange",
    "green",
    "brown",
    "grey",
    "red",
    "yellow",
    "violet",
    "pink",
    "white",
    "black",
    "turquoise",
  ],
  EPlus: [
    "blue",
    "orange",
    "green",
    "brown",
    "grey",
    "pink",
    "red",
    "black",
    "yellow",
    "violet",
    "white",
    "turquoise",
  ],
  Level3: [
    "blue",
    "orange",
    "green",
    "brown",
    "grey",
    "white",
    "red",
    "black",
    "yellow",
    "violet",
    "brown",
    "pink",
  ],
  Swisscom: [
    "red",
    "green",
    "yellow",
    "blue",
    "white",
    "violet",
    "orange",
    "black",
    "grey",
    "brown",
    "pink",
    "turquoise",
  ],
  Gasline: [
    "red",
    "green",
    "blue",
    "yellow",
    "white",
    "grey",
    "brown",
    "violet",
    "turquoise",
    "black",
    "orange",
    "pink",
  ],
};

function isDark(color: string): boolean {
  const darkColors = ["blue", "green", "brown", "black", "violet", "turquoise"];
  return darkColors.includes(color.toLowerCase());
}

interface Fiber {
  fiberNumber: number;
  color: string;
}

interface Connection {
  fiberNumber: number;
  colorCable1: string;
  colorCable2: string;
}

const FiberBundleForm: React.FC = () => {
  const [bundleCount1, setBundleCount1] = useState<number>(0);
  const [fibersPerBundle1, setFibersPerBundle1] = useState<number>(12);
  const [fiberColorCodeType1, setFiberColorCodeType1] = useState<string>("DIN");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [bundleCount2, setBundleCount2] = useState<number>(0);
  const [fibersPerBundle2, setFibersPerBundle2] = useState<number>(12);
  const [fiberColorCodeType2, setFiberColorCodeType2] = useState<string>("DIN");

  const [connectionMode, setConnectionMode] = useState<string>("1:1");
  const [connections, setConnections] = useState<Connection[]>([]);

  const calculateBundles = (
    bundleCount: number,
    fibersPerBundle: number,
    fiberColorCodeType: string
  ): Fiber[] => {
    const bundles: Fiber[] = [];
    let fiberCount = 1;

    for (let i = 0; i < bundleCount; i++) {
      for (let j = 0; j < fibersPerBundle; j++) {
        const fiberColor =
          colorCodes[fiberColorCodeType][
            j % colorCodes[fiberColorCodeType].length
          ];
        bundles.push({ fiberNumber: fiberCount++, color: fiberColor });
      }
    }
    return bundles;
  };

  const calculateConnections = () => {
    const bundles1 = calculateBundles(
      bundleCount1,
      fibersPerBundle1,
      fiberColorCodeType1
    );
    const bundles2 = calculateBundles(
      bundleCount2,
      fibersPerBundle2,
      fiberColorCodeType2
    );

    let newConnections: Connection[] = [];

    if (connectionMode === "1:1") {
      const maxLength = Math.min(bundles1.length, bundles2.length);
      for (let i = 0; i < maxLength; i++) {
        newConnections.push({
          fiberNumber: i + 1,
          colorCable1: bundles1[i].color,
          colorCable2: bundles2[i].color,
        });
      }
    } else {
      // Logic for "Use All" mode
      const maxLength = Math.max(bundles1.length, bundles2.length);
      for (let i = 0; i < maxLength; i++) {
        newConnections.push({
          fiberNumber: i + 1,
          colorCable1: bundles1[i]?.color || "transparent",
          colorCable2: bundles2[i]?.color || "transparent",
        });
      }
    }

    setConnections(newConnections);
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (fibersPerBundle1 > 12 || fibersPerBundle2 > 12) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
    event.preventDefault();
    calculateConnections();
  };

  return (
    <div className="fiber-bundle-form">
      <h1>Glasfaserkabel Verbindung</h1>
      <div className="form-container">
        {/* Kabel 1 Formular */}
        <div className="form-section">
          <h2 className="text-lg font-bold">Kabel 1</h2>
          <div className="form-field">
            <label htmlFor="bundleCount1">Bündelanzahl:</label>
            <input
              type="number"
              id="bundleCount1"
              value={bundleCount1}
              onChange={(e) => setBundleCount1(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="fibersPerBundle1">Fasern pro Bündel:</label>
            <input
              type="number"
              id="fibersPerBundle1"
              value={fibersPerBundle1}
              onChange={(e) =>
                setFibersPerBundle1(parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div className="form-field">
            <label htmlFor="fiberColorCodeType1">Fasern-Farbcode:</label>
            <select
              id="fiberColorCodeType1"
              value={fiberColorCodeType1}
              onChange={(e) => setFiberColorCodeType1(e.target.value)}
            >
              {Object.keys(colorCodes).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trennlinie */}
        <div className="divider"></div>

        {/* Kabel 2 Formular */}
        <div className="form-section">
          <h2 className="text-lg font-bold">Kabel 2</h2>
          <div className="form-field">
            <label htmlFor="bundleCount2">Bündelanzahl:</label>
            <input
              type="number"
              id="bundleCount2"
              value={bundleCount2}
              onChange={(e) => setBundleCount2(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="fibersPerBundle2">Fasern pro Bündel:</label>
            <input
              type="number"
              id="fibersPerBundle2"
              value={fibersPerBundle2}
              onChange={(e) =>
                setFibersPerBundle2(parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div className="form-field">
            <label htmlFor="fiberColorCodeType2">Fasern-Farbcode:</label>
            <select
              id="fiberColorCodeType2"
              value={fiberColorCodeType2}
              onChange={(e) => setFiberColorCodeType2(e.target.value)}
            >
              {Object.keys(colorCodes).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="connectionMode">Verbindungsmodus:</label>
        <select
          id="connectionMode"
          value={connectionMode}
          onChange={(e) => setConnectionMode(e.target.value)}
        >
          <option value="1:1">1:1</option>
          <option value="Alle benutzen">Alle benutzen</option>
        </select>
      </div>

      <button type="submit" onClick={handleSubmit}>
        Verbinden
      </button>

      {showWarning && (
        <div className="warning-dialog">
          <p>Achtung: Über 12 Fasern ausgewählt. Spezialfarbcode beachten!</p>
          <button onClick={() => setShowWarning(false)}>Schließen</button>
        </div>
      )}

      {connections.length > 0 && (
        <ConnectionVisualization
          connections={connections}
          fiberColorCode1={fiberColorCodeType1}
          fiberColorCode2={fiberColorCodeType2}
        />
      )}
    </div>
  );
};

const ConnectionVisualization: React.FC<{
  connections: Connection[];
  fiberColorCode1: string;
  fiberColorCode2: string;
}> = ({ connections, fiberColorCode1, fiberColorCode2 }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(
    []
  );

  useEffect(() => {
    filterConnections();
  }, [searchTerm, connections]);

  const filterConnections = () => {
    const filtered = connections.filter((connection) => {
      return connection.fiberNumber.toString().includes(searchTerm);
    });
    setFilteredConnections(filtered);
  };

  return (
    <div>
      <div className="pt-5">
        <input
          type="text"
          placeholder="Faser suchen..."
          value={searchTerm}
          className="w-32 md:w-auto bg-gray-100 border border-gray-400 rounded-md py-1 px-3 md:px-5 lg:px-8 focus:outline-none focus:border-emerald-500 text-gray-700"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className=" absolute left-1/2 pt-9 pl-1.5 transform -translate-y-1/2 text-gray-500 pointer-events-none"
        />
      </div>
      <div className="connection-visualization">
        <div className="connection-header">
          <div>
            <span className="absolute left-2 py-2 text-lg font-bold">
              Kabel 1 {fiberColorCode1}
            </span>
            <span className="absolute right-2 py-2 text-lg font-bold">
              Kabel 2 {fiberColorCode2}
            </span>
          </div>
        </div>
        {filteredConnections.map((connection, index) => (
          <div key={index} className="connection">
            <span
              style={{
                color: isDark(connection.colorCable1) ? "white" : "black",
                backgroundColor: connection.colorCable1,
              }}
            >
              {connection.fiberNumber}
            </span>{" "}
            <span
              style={{
                color: isDark(connection.colorCable2) ? "white" : "black",
                backgroundColor: connection.colorCable2,
              }}
            >
              {connection.fiberNumber}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiberBundleForm;
