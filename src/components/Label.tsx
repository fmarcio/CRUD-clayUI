import React, { type CSSProperties } from "react";

export enum LabelColors {
  BLUE = "blue",
  GRAY = "gray",
}

interface ILabelProps {
  labelText: string;
  labelColor: LabelColors.BLUE | LabelColors.GRAY;
}

const colorMap: Record<string, string> = {
  blue: "#2577cfff",
  gray: "#8b9196ff",
};

const labelStyle: CSSProperties = {
  padding: "0.6em",
  fontSize: "75%",
  fontWeight: "700",
  lineHeight: "1",
  color: "inherit",
  textAlign: "center",
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
  borderRadius: "0.25rem",
  backgroundColor: "transparent",
};

const Label: React.FC<ILabelProps> = ({ labelText, labelColor }) => {
  const color = colorMap[labelColor] || colorMap.gray;

  const finalStyle: CSSProperties = {
    ...labelStyle,
    color,
    border: `1px solid ${color}`,
  };

  return <span style={finalStyle}>{labelText}</span>;
};

export default Label;
