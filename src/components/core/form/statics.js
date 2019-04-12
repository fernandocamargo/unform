import noop from "lodash/noop";
import { func } from "prop-types";

export const displayName = "Core/Form";

export const propTypes = {
  onChange: func,
  onSubmit: func
};

export const defaultProps = {
  onChange: noop,
  onSubmit: noop
};
