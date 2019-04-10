import React, { lazy, Suspense, createElement } from "react";
import { arrayOf, shape, string, oneOf, func } from "prop-types";

export const Core = props => (
  <form>
    <fieldset>
      <legend>this is a form</legend>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </fieldset>
  </form>
);

export const delay = event => ({
  for: duration =>
    new Promise(resolve => window.setTimeout(() => resolve(event), duration))
});

export const wrap = settings => {
  const { asEnum, asPropType, asPromise } = Object.entries(settings).reduce(
    ({ asEnum, asPropType, asPromise }, [type, promise]) => ({
      asEnum: Object.assign(asEnum, { [type]: type }),
      asPropType: asPropType.concat(type),
      asPromise: asPromise.concat(promise)
    }),
    { asEnum: {}, asPropType: [], asPromise: [] }
  );
  const propTypes = {
    fields: arrayOf(
      shape({
        name: string.isRequired,
        type: oneOf(asPropType).isRequired
      })
    ).isRequired,
    onChange: func,
    onSubmit: func
  };
  const ExtendedCore = props =>
    createElement(Object.assign(Core, { propTypes }), props);
  const Chain = lazy(() =>
    Promise.all(asPromise).then(() => ({ default: ExtendedCore }))
  );

  return {
    Form: props => (
      <Suspense fallback={<p>Loading...</p>}>
        <Chain {...props} />
      </Suspense>
    ),
    TYPES: asEnum
  };
};

export const { Form, TYPES } = wrap({
  TEXT: import("components/fields/text"),
  SELECT: import("components/fields/select"),
  ERROR: import("components/fields/error"),
  DRAFT: import("components/fields/draft")
});

export default () => (
  <div>
    <h1>Using unform</h1>
    <pre>{JSON.stringify(TYPES, null, 2)}</pre>
    <Form
      fields={[
        {
          name: "forename",
          type: TYPES.TEXT
        },
        {
          name: "surname",
          type: TYPES.TEXT
        },
        {
          name: "bio",
          type: TYPES.DRAFT
        }
      ]}
      onChange={form => console.log("onChange();", form)}
      onSubmit={form => console.log("onSubmit();", form)}
    />
  </div>
);
