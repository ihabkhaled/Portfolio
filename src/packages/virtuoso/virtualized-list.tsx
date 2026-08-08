'use client';
// client-boundary-reason: virtualization measures the viewport and handles scroll events at runtime.

import type { ReactElement } from 'react';
import { Virtuoso } from 'react-virtuoso';

export interface VirtualizedListProperties<TItem> {
  readonly items: readonly TItem[];
  readonly heightPx: number;
  readonly computeItemKey: (item: TItem, index: number) => string;
  readonly renderItem: (item: TItem, index: number) => ReactElement;
  /**
  Rows rendered before measurement (SSR and non-layout environments).
  */
  readonly initialRenderCount?: number;
  readonly testId?: string;
}

/**
 * Long lists (100+ rows) render through this wrapper instead of `.map()` so
 * the DOM stays small. See rules/12-performance.md.
 */
export function VirtualizedList<TItem>(properties: VirtualizedListProperties<TItem>): ReactElement {
  const measurementProperties =
    properties.initialRenderCount === undefined
      ? {}
      : { initialItemCount: properties.initialRenderCount };

  return (
    <Virtuoso<TItem>
      data={properties.items}
      style={{ height: properties.heightPx }}
      computeItemKey={(index, item) => properties.computeItemKey(item, index)}
      itemContent={(index, item) => properties.renderItem(item, index)}
      data-testid={properties.testId}
      {...measurementProperties}
    />
  );
}
