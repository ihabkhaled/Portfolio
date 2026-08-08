import type { ReactElement } from 'react';

import type { StructuredDataScriptProperties } from '../types/shared-component.types';

/**
 * Renders pre-serialized JSON-LD as the script's text content — never
 * `dangerouslySetInnerHTML`. The caller (`structured-data.helper.ts`)
 * escapes `<` before this ever receives the string.
 */
export function StructuredDataScript(properties: StructuredDataScriptProperties): ReactElement {
  return <script type="application/ld+json">{properties.json}</script>;
}
