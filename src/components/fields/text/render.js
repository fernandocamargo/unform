import React, { useCallback } from "react";

export default ({ onChange: change, ...props }) => {
  const onChange = useCallback(({ target: { value } }) => change(value), []);

  return <input onChange={onChange} {...props} />;
};
