/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import { DOMSource } from '@cycle/dom/rxjs-typings';
import { VNode } from '@cycle/dom';

import {
  Observable,
} from 'rxjs';

// TS doesn't like trailing commas in enums
export enum MessageType {
  ERROR,
  PLAY_SONG
}

export type Message<T> = {
  type: MessageType,
  payload: T
}

export enum ErrorType {
  DISCONNECTED,
  UNKNOWN
}

export type ErrorPayload = {
  type: ErrorType,
  message?: string,
}

export type Note = {
  note: number,
  velocity: number,
  duration: number,
}

export type Tabs = {
  label: string,
  component: (Sources<any>) => Sinks,
}

export type Sources<T> = {
  DOM?: DOMSource,
  hostPage?: Observable<T>,
  messages: Observable<Message<any>>,
  pianoConnection?: Observable<Message<ErrorPayload>>,
}

export type Sinks = {
  DOM?: Observable<VNode>,
  hostPage?: Observable<string>,
  messages?: Observable<Message<any>>,
  piano?: Observable<Note>,
  pianoConnection?: Observable<any>,
}
