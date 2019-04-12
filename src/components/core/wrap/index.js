import React, { lazy, Suspense, createElement } from "react";
import { arrayOf, shape, string, oneOf, func } from "prop-types";

import Core from "components/core";

export default ({ fields }) => {
  const { asEnum, asPropType, asPromise } = Object.entries(fields).reduce(
    ({ asEnum, asPropType, asPromise }, [type, promise]) => ({
      asEnum: Object.assign(asEnum, { [type]: type }),
      asPropType: asPropType.concat(type),
      asPromise: asPromise.concat(promise)
    }),
    { asEnum: {}, asPropType: [], asPromise: [] }
  );
  const Resolver = lazy(() =>
    Promise.all(asPromise).then(modules => {
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
      const components = modules.reduce(
        (stack, { default: component }, index) =>
          Object.assign(stack, {
            [asPropType[index]]: component
          }),
        {}
      );
      const ExtendedCore = props =>
        createElement(Object.assign(Core, { propTypes }), {
          ...props,
          components
        });

      return { default: ExtendedCore };
    })
  );
  const Form = props => (
    <Suspense fallback={<p>Loading...</p>}>
      <Resolver {...props} />
    </Suspense>
  );

  return { TYPES: asEnum, Form };
};
