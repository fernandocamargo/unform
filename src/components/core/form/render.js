import get from "lodash/get";
import update from "immutability-helper";
import React, { useCallback, useState, createElement } from "react";

export default ({ components, fields, onChange, onSubmit }) => {
  const extract = useCallback(
    (data, { type, name, value }) =>
      Object.assign(data, {
        [name]: value || get(components, [type, "defaultProps", "value"])
      }),
    [fields]
  );
  const [meta, setMeta] = useState({
    original: true,
    data: fields.reduce(extract, {})
  });
  const render = useCallback(
    ({ name, type, settings, validation, ...props }) => {
      const propagate = useCallback(
        next => {
          onChange(next, name);

          return next;
        },
        [name]
      );

      return (
        <div key={name}>
          {createElement(components[type], {
            ...props,
            ...settings,
            value: meta.data[name],
            onChange: useCallback(
              value =>
                setMeta(current =>
                  propagate(
                    update(current, {
                      original: { $set: false },
                      data: {
                        [name]: { $set: value }
                      }
                    })
                  )
                ),
              [name]
            ),
            name
          })}
        </div>
      );
    },
    [meta]
  );
  const submit = useCallback(
    event => {
      event.preventDefault();
      onSubmit(meta);
    },
    [meta]
  );

  return (
    <form name="core" id="core" action="" method="post" onSubmit={submit}>
      <fieldset>
        <legend>this is a form</legend>
        <pre>{JSON.stringify(meta, null, 2)}</pre>
        {fields.map(render)}
        <input type="submit" />
      </fieldset>
    </form>
  );
};
