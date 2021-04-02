import React from 'react';
import easing from './easing';

/**
 * toArray - converts a node list into an array.
 * @param nodeList - the node list to convert
 * @returns an array of nodes or elements
 */
const toArray = (nodeList: NodeListOf<ChildNode>) => Array.prototype.slice.call(nodeList) as HTMLElement[];

/**
 * getAbsoluteHeight - calculates the full height of a DOM element,
 * including the margin, border, and node dimensions
 *
 * @param el - the DOM element to perform the calculation on
 *
 * @returns the height, in pixels of the element
 */
const getAbsoluteHeight = (el: HTMLElement): number => {
  if (!el) {
    return 0;
  }
  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

interface ScrollTo {
  (element: Element | undefined, targetValue: number, durationMs: number, easing?: (n: number) => number, global?: typeof globalThis): void;
}

const scrollTo: ScrollTo = (element = globalThis?.document?.scrollingElement ?? undefined, targetValue, durationMs, easeFn = easing.linear, global = window) => {
  const { scrollTop } = element ?? {};
  if (!element || scrollTop == null || scrollTop === targetValue) {
    return;
  }

  const totalScrollDistance = targetValue - scrollTop;
  let oldTimestamp: number | null = null;

  const step = (newTimestamp: number): boolean | void => {
    if (oldTimestamp === null) {
      oldTimestamp = newTimestamp;
    }
    const progress = Math.min(1.00, (newTimestamp - oldTimestamp) / durationMs);
    const easedProgress = easeFn(progress);
    const scrollY = scrollTop + (totalScrollDistance * easedProgress);
    element.scrollTop = scrollY;
    if (progress >= 1.0) {
      return;
    }
    globalThis.requestAnimationFrame(step);
  }
  globalThis.requestAnimationFrame(step);
}


export const nodeList = {
  toArray,
};

export const domElement = {
  getAbsoluteHeight,
  scrollTo,
};
