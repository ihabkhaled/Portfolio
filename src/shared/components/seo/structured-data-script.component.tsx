import type { ReactElement } from 'react';

import type { StructuredDataScriptProps } from '../types/shared-component.types';

/**
 * Renders pre-serialized JSON-LD as the script's text content — never
 * `dangerouslySetInnerHTML`. The caller (`structured-data.helper.ts`)
 * escapes `<` before this ever receives the string.
 */
export function StructuredDataScript(props: StructuredDataScriptProps): ReactElement {
  return <script type="application/ld+json">{props.json}</script>;
}
