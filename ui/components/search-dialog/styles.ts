import { CSSProperties } from "react";

export const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

export const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  color: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
  border: " 1px solid rgba(255,255,255,.2)",
  background: "#121212",
};

export const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};
