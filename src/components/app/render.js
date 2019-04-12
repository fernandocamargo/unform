import React from "react";

import { wrap } from "components/core";

export const { Form, TYPES } = wrap({
  fields: {
    TEXT: import("components/fields/text"),
    SELECT: import("components/fields/select"),
    ERROR: import("components/fields/error")
  }
});

export default () => (
  <div>
    <h1>Using unform</h1>
    <pre>{JSON.stringify(TYPES, null, 2)}</pre>
    <Form
      fields={[
        {
          name: "forename",
          type: TYPES.TEXT,
          value: "Fernando",
          settings: {
            placeholder: "Your forename"
          }
        },
        {
          name: "surname",
          type: TYPES.TEXT,
          settings: {
            placeholder: "Your surname"
          }
        },
        {
          name: "email",
          type: TYPES.TEXT,
          settings: {
            type: "email"
          }
        },
        {
          name: "password",
          type: TYPES.TEXT,
          settings: {
            type: "password"
          },
          validation: value => {
            const trimmed = String(value).trim();

            return {
              length: {
                min: trimmed >= 8,
                max: trimmed <= 20
              },
              rules: {
                uppercase: /[A-Z\u00C0-\u017F\s]/.test(trimmed),
                lowecase: /[A-Z\u00C0-\u017F\s]/.test(trimmed),
                number: /[0-9\s]/.test(trimmed),
                special: /^.*?\W/.test(trimmed)
              }
            };
          }
        }
      ]}
    />
  </div>
);
