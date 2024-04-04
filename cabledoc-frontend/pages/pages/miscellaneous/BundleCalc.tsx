import React, { useState } from "react";
import "./BundleCalc.css";

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

const FiberBundleForm: React.FC = () => {
  const [bundleCount, setBundleCount] = useState<number>(0);
  const [fibersPerBundle, setFibersPerBundle] = useState<number>(12); // Standardwert auf 12 setzen
  const [bundleColorCodeType, setBundleColorCodeType] = useState<string>("DIN");
  const [fiberColorCodeType, setFiberColorCodeType] = useState<string>("DIN");
  const [tableData, setTableData] = useState<string[][][]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Warnungs-Dialog anzeigen, wenn die Anzahl der Fasern pro Bündel mehr als 12 ist
    if (fibersPerBundle > 12) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    const bundles = calculateBundles();
    setTableData(bundles);
  };

  const calculateBundles = (): string[][][] => {
    const bundles: string[][][] = [];
    let fiberCount = 1;

    for (let i = 0; i < bundleCount; i++) {
      const bundle: string[][] = [];
      for (let j = 0; j < fibersPerBundle; j++) {
        const bundleColorIndex = i % colorCodes[bundleColorCodeType].length;
        const fiberColorIndex = j % colorCodes[fiberColorCodeType].length;
        const bundleColor = colorCodes[bundleColorCodeType][bundleColorIndex];
        const fiberColor = colorCodes[fiberColorCodeType][fiberColorIndex];
        bundle.push([fiberColor, bundleColor, fiberCount.toString()]);
        fiberCount++;
      }
      bundles.push(bundle);
    }
    return bundles;
  };

  return (
    <div className="fiber-bundle-form">
      <h1>Bündelrechner</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="bundleCount">Bündelanzahl:</label>
          <input
            type="number"
            id="bundleCount"
            value={bundleCount}
            onChange={(e) => setBundleCount(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="fibersPerBundle">Fasern pro Bündel:</label>
          <input
            type="number"
            id="fibersPerBundle"
            value={fibersPerBundle}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 0 && value <= 24) {
                setFibersPerBundle(value);
              }
            }}
            min={0} // Mindestwert auf 0 setzen
            max={24} // Maximalwert auf 24 setzen
          />
        </div>
        <div className="form-field">
          <label htmlFor="bundleColorCodeType">Bündel-Farbcode:</label>
          <select
            id="bundleColorCodeType"
            value={bundleColorCodeType}
            onChange={(e) => setBundleColorCodeType(e.target.value)}
          >
            <option value="DIN">DIN</option>
            <option value="Bellcore">Bellcore</option>
            <option value="COLT">COLT</option>
            <option value="EPlus">EPlus</option>
            <option value="Level3">Level3</option>
            <option value="Swisscom">Swisscom</option>
            <option value="Gasline">Gasline</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="fiberColorCodeType">Fasern-Farbcode:</label>
          <select
            id="fiberColorCodeType"
            value={fiberColorCodeType}
            onChange={(e) => setFiberColorCodeType(e.target.value)}
          >
            <option value="DIN">DIN</option>
            <option value="Bellcore">Bellcore</option>
            <option value="COLT">COLT</option>
            <option value="EPlus">EPlus</option>
            <option value="Level3">Level3</option>
            <option value="Swisscom">Swisscom</option>
            <option value="Gasline">Gasline</option>
          </select>
        </div>
        <button type="submit">Abschicken</button>
      </form>
      {showWarning && (
        <div className="warning-dialog">
          <p>Achtung: Über 12 Fasern ausgewählt. Spezialfarbcode beachten!</p>
          <button onClick={() => setShowWarning(false)}>Schließen</button>
        </div>
      )}

      {tableData.length > 0 && <BundleTable data={tableData} />}
    </div>
  );
};

interface BundleTableProps {
  data: string[][][];
}

const BundleTable: React.FC<BundleTableProps> = ({ data }) => {
  return (
    <div className="bundle-table">
      <table>
        <thead style={{ backgroundColor: "black" }}>
          <tr>
            <th>Bündel</th>
            <th>Fasern</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bundle, bundleIndex) => (
            <tr key={bundleIndex}>
              <td
                className="bundle-cell"
                style={{
                  backgroundColor: bundle[0][1],
                  color: isDark(bundle[0][1]) ? "white" : "black",
                }}
              >
                {`Bündel ${bundleIndex + 1}`}
              </td>
              <td className="fiber-cell">
                {bundle.map((colors, fiberIndex) => (
                  <span
                    key={fiberIndex}
                    className="fiber"
                    style={{
                      backgroundColor: colors[0],
                      color: isDark(colors[0]) ? "white" : "black", // Dynamische Textfarbe
                      position: "relative",
                    }}
                  >
                    {colors[2]}
                    {/* Zusätzlicher Strich für Fasern über 12 */}
                    {fiberIndex >= 12 && (
                      <span
                        className="extra-stripe"
                        style={{
                          backgroundColor: isDark(colors[0])
                            ? "white"
                            : "black",
                        }}
                      ></span>
                    )}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FiberBundleForm;
