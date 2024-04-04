"use client";
import React, { useEffect, useState, useRef } from "react";
import "./AttenuationCalc.css";
import Divider from "@mui/material/Divider";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IAttenuationRate {
  connectorLoss: string;
  spliceLoss: string;
  lengthLoss: string;
}

interface IAttenuationCalcState {
  faserLaenge: string;
  spleissVerbindungen: string;
  steckerVerbindungen: string;
  attenuationRates: { "1310nm": IAttenuationRate; "1550nm": IAttenuationRate };
}

const defaultAttenuationRates: {
  "1310nm": IAttenuationRate;
  "1550nm": IAttenuationRate;
} = {
  "1310nm": { connectorLoss: "1.2", spliceLoss: "0.3", lengthLoss: "0.38" },
  "1550nm": { connectorLoss: "0.7", spliceLoss: "0.2", lengthLoss: "0.22" },
};

const InfoTooltip: React.FC<{ show: boolean; target: any }> = ({
  show,
  target,
}) => (
  <Overlay target={target} show={show} placement="top">
    {(props) => (
      <Tooltip id="info-tooltip" {...props} className="custom-tooltip">
        <p className="text-align text-center">
          Die standardmäßig gesetzten Werte basieren auf Angaben der Cisco
          Systems Inc. <br />
          Bei Bedarf können die Werte hier angepasst werden.
        </p>
      </Tooltip>
    )}
  </Overlay>
);

const AttenuationCalc: React.FC = () => {
  const [state, setState] = useState<IAttenuationCalcState>({
    faserLaenge: "",
    spleissVerbindungen: "",
    steckerVerbindungen: "",
    attenuationRates: defaultAttenuationRates,
  });

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipTarget = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipTarget.current &&
        !tooltipTarget.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const newValue = type === "number" && parseFloat(value) < 0 ? "0" : value;
    setState({ ...state, [name]: newValue });
  };

  const handleRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    waveLengthMode: "1310nm" | "1550nm",
    rateType: keyof IAttenuationRate
  ) => {
    const inputValue = event.target.value;
    const newValue = parseFloat(inputValue) < 0 ? "0" : inputValue;
    const newRates = {
      ...state.attenuationRates,
      [waveLengthMode]: {
        ...state.attenuationRates[waveLengthMode],
        [rateType]: newValue,
      },
    };
    setState({ ...state, attenuationRates: newRates });
  };

  const calculateAttenuation = (
    waveLengthMode: "1310nm" | "1550nm"
  ): number => {
    const {
      faserLaenge,
      spleissVerbindungen,
      steckerVerbindungen,
      attenuationRates,
    } = state;
    const rates = attenuationRates[waveLengthMode];
    const faserLaengeNumber = Math.max(0, parseFloat(faserLaenge) || 0);
    const spleissVerbindungenNumber = Math.max(
      0,
      parseFloat(spleissVerbindungen) || 0
    );
    const steckerVerbindungenNumber = Math.max(
      0,
      parseFloat(steckerVerbindungen) || 0
    );
    const laengeVerlust =
      (faserLaengeNumber / 1000) * parseFloat(rates.lengthLoss);
    const spleissVerlust =
      spleissVerbindungenNumber * parseFloat(rates.spliceLoss);
    const steckerVerlust =
      steckerVerbindungenNumber * parseFloat(rates.connectorLoss);
    return laengeVerlust + spleissVerlust + steckerVerlust;
  };

  const handleInfoButtonClick = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const totalAttenuation1310 = calculateAttenuation("1310nm");
  const totalAttenuation1550 = calculateAttenuation("1550nm");

  return (
    <div className="attenuation-calc">
      <h1>Dämpfungsrechner</h1>
      <div className="form-container">
        <div className="form-field">
          <label>Faserlänge (m):</label>
          <input
            type="number"
            name="faserLaenge"
            placeholder="Wert eingeben..."
            value={state.faserLaenge}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label>Anzahl der Spleißverbindungen:</label>
          <input
            type="number"
            name="spleissVerbindungen"
            placeholder="Wert eingeben..."
            value={state.spleissVerbindungen}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label>Anzahl der Steckverbindungen:</label>
          <input
            type="number"
            name="steckerVerbindungen"
            placeholder="Wert eingeben..."
            value={state.steckerVerbindungen}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="py-3"></div>
      <Divider orientation="horizontal" flexItem />
      <div className="py-3"></div>

      <Container>
        <Row className="justify-content-md-center align-items-center">
          <Col>
            <div className="header-with-info-button">
              <h1>Parameter</h1>

              <Popover>
                <div className="w-2 rounded-s-full">
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <div className="info-button"></div>
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the dimensions for the layer.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="parameter-container">
        <Row>
          <div className="attenuation-visualization">
            <Col className="form-column">
              <div className="text-2xl py-2 font-semibold">1310nm Mode</div>

              <div className="form-field">
                <label>Spleißverlust (dB):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1310nm"].spliceLoss}
                  onChange={(e) => handleRateChange(e, "1310nm", "spliceLoss")}
                />
              </div>
              <div className="form-field">
                <label>Steckverbindungsverlust (dB):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1310nm"].connectorLoss}
                  onChange={(e) =>
                    handleRateChange(e, "1310nm", "connectorLoss")
                  }
                />
              </div>
              <div className="form-field">
                <label>Längenverlust (dB/km):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1310nm"].lengthLoss}
                  onChange={(e) => handleRateChange(e, "1310nm", "lengthLoss")}
                />
              </div>
            </Col>
          </div>
        </Row>
        <Divider orientation="vertical" flexItem />
        <Row>
          <div className="attenuation-visualization">
            <Col className="form-column">
              <div className="text-2xl py-2 font-semibold">1550nm Mode</div>
              <div className="form-field">
                <label>Spleißverlust (dB):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1550nm"].spliceLoss}
                  onChange={(e) => handleRateChange(e, "1550nm", "spliceLoss")}
                />
              </div>
              <div className="form-field">
                <label>Steckverbindungsverlust (dB):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1550nm"].connectorLoss}
                  onChange={(e) =>
                    handleRateChange(e, "1550nm", "connectorLoss")
                  }
                />
              </div>
              <div className="form-field">
                <label>Längenverlust (dB/km):</label>
                <input
                  type="number"
                  value={state.attenuationRates["1550nm"].lengthLoss}
                  onChange={(e) => handleRateChange(e, "1550nm", "lengthLoss")}
                />
              </div>
            </Col>
          </div>
        </Row>
      </Container>
      <div className="py-4"></div>
      <Divider orientation="horizontal" flexItem />
      <AttenuationVisualization
        attenuation1310={totalAttenuation1310}
        attenuation1550={totalAttenuation1550}
        state={state}
      />
    </div>
  );
};

const AttenuationVisualization: React.FC<{
  attenuation1310: number;
  attenuation1550: number;
  state: IAttenuationCalcState;
}> = ({ attenuation1310, attenuation1550, state }) => {
  // Berechnungen...
  const faserLaengeNum1310 = parseFloat(state.faserLaenge) || 0;
  const spleissVerbindungenNum1310 = parseFloat(state.spleissVerbindungen) || 0;
  const steckerVerbindungenNum1310 = parseFloat(state.steckerVerbindungen) || 0;

  const faserLaengeNum1550 = parseFloat(state.faserLaenge) || 0;
  const spleissVerbindungenNum1550 = parseFloat(state.spleissVerbindungen) || 0;
  const steckerVerbindungenNum1550 = parseFloat(state.steckerVerbindungen) || 0;

  return (
    <div>
      <h1 className="pt-5">Ergebnisse</h1>
      <div className="attenuation-visualization">
        <div className="attenuation-details-column">
          <div className="text-xl">1310nm Mode</div>
          <div className="text-lg font-semibold">
            Gesamtverlust: {attenuation1310.toFixed(2)} dB
          </div>
          <div>
            • Längenverlust:{" "}
            {(
              (faserLaengeNum1310 / 1000) *
              parseFloat(state.attenuationRates["1310nm"].lengthLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
          <div>
            • Spleißverlust:{" "}
            {(
              spleissVerbindungenNum1310 *
              parseFloat(state.attenuationRates["1310nm"].spliceLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
          <div>
            • Steckverbindungsverlust:{" "}
            {(
              steckerVerbindungenNum1310 *
              parseFloat(state.attenuationRates["1310nm"].connectorLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="attenuation-details-column">
          <div className="text-xl">1550nm Mode</div>
          <div className="text-lg font-semibold">
            Gesamtverlust: {attenuation1550.toFixed(2)} dB
          </div>
          <div>
            • Längenverlust:{" "}
            {(
              (faserLaengeNum1550 / 1000) *
              parseFloat(state.attenuationRates["1550nm"].lengthLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
          <div>
            • Spleißverlust:{" "}
            {(
              spleissVerbindungenNum1550 *
              parseFloat(state.attenuationRates["1550nm"].spliceLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
          <div>
            • Steckverbindungsverlust:{" "}
            {(
              steckerVerbindungenNum1550 *
              parseFloat(state.attenuationRates["1550nm"].connectorLoss)
            ).toFixed(2)}{" "}
            dB
          </div>
        </div>
      </div>
    </div>
  );
};
export default AttenuationCalc;
