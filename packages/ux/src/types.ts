import type { FunctionComponent, ReactNode } from 'react';

export type UXEvent<T = string> = {
  type: T;
  name: string;
  details?: object | string | number | null;
  event?: Event;
};

export type OnUXEvent<T = string> = (event: UXEvent<T>) => void;

type StoryDecorator = (story: FunctionComponent) => ReactNode;

export type StoryDefinition = {
  component: FunctionComponent,
  title: string;
  parameters: {
    notes?: string;
  },
  decorators: StoryDecorator[];
};

export interface Story extends FunctionComponent{
  story: {
    name: string;
  }
}

// Global Types
export interface Size {
  width: number;
  height: number;
}
