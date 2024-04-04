import Autocomplete from "@mui/material/Autocomplete";
import { inputLayout, labelLayout } from "./Layout/tailwindStyles";
import { ChangeEvent } from "react";

interface DataItem {
  id: number;
  name: string;
}

export default function AutoCompleteBox({
  data,
  name,
  modelName,
  value,
  handleChange,
}: {
  data: any;
  name: string;
  modelName: string;
  value: string | number;
  handleChange: (
    event: ChangeEvent<{}>,
    newValue: DataItem | null,
    id: string
  ) => void;
}) {
  return (
    <>
      <label className={labelLayout} htmlFor={"search-" + modelName}>
        {name}
      </label>
      <Autocomplete
        // sx={{
        //   display: "inline-block",
        //   "& input": {
        //     width: 200,
        //     bgcolor: "background.paper",
        //     color: (theme) =>
        //       theme.palette.getContrastText(theme.palette.background.paper),
        //   },
        // }}
        id={"search-" + modelName}
        options={data}
        onChange={(event, newValue) => handleChange(event, newValue, modelName)}
        getOptionLabel={(option: DataItem) => option.name}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input
              type="text"
              {...params.inputProps}
              className={inputLayout + " mb-3"}
              value={value as string}
            />
          </div>
        )}
      />
    </>
  );
}
