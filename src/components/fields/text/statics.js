import { oneOf } from "prop-types";

export const displayName = "Fields/Text";

export const propTypes = {
  type: oneOf(["text", "password", "email"])
};

export const defaultProps = {
  text: "text",
  value: ""
};
