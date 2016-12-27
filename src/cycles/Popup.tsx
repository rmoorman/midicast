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

import {
  Observable,
} from 'rxjs';

import {
  VNode,
  html
} from 'snabbdom-jsx';

import {
  Column,
  InflexibleRow,
  MaterialIcon,
  Row,
} from '../snabstyle';

import {
  MessageType,
  PlaybackStatus,
  Sources,
  Sinks,
} from '../types';

import TabbedPane from './TabbedPane';
import SongScanner from './SongScanner';

export default function Popup({ DOM, messages: message$, ...sources }: Sources<any>): Sinks {
  // TODO: find a way to make this get the current status from the background
  // page when the popup reopens
  const currentPlaybackStatus$: Observable<PlaybackStatus> = message$.filter(
    message => message.type === MessageType.PLAYBACK_STATUS_CHANGED
  ).pluck('payload').startWith(PlaybackStatus.STOPPED);

  const buttonAction$ = currentPlaybackStatus$.map(
    currentPlaybackStatus => {
      if (currentPlaybackStatus === PlaybackStatus.PLAYING) {
        return PlaybackStatus.STOPPED;
      } else {
        return PlaybackStatus.PLAYING;
      }
    }
  );

  const changePlaybackStatus$ = DOM.select('#play-button').events('click').withLatestFrom(
    buttonAction$
  // Play isn't implemented yet, so only send Stop
  ).map(([, action]) => action).filter(action => action === PlaybackStatus.STOPPED).map(
    (requestedStatus) => (
      {
        type: MessageType.CHANGE_PLAYBACK_STATUS,
        payload: requestedStatus,
      }
    )
  );

  const buttonIcon$ = buttonAction$.map(
    status => (
      {
        [PlaybackStatus.PLAYING]: 'play_arrow',
        [PlaybackStatus.STOPPED]: 'stop',
      }[status]
    )
  );

  const tabbedPane = TabbedPane({
    DOM,
    tabs: Observable.of(
      [
        {
          label: 'songs on this page',
          component: SongScanner,
        },
      ],
    ),
    messages: message$,
    ...sources,
  });
  const tabbedPaneDOM$: Observable<VNode> = tabbedPane.DOM;

  return {
    ...tabbedPane,
    DOM: Observable.combineLatest(
      tabbedPaneDOM$,
      buttonIcon$,
    ).map(
      ([
        tabbedPaneDOM,
        buttonIcon,
      ]) => (
        <Column
          className = 'mdc-theme--background'
          width = { 600 }
          height = { 600 }
        >
          <InflexibleRow
            alignItems = 'center'
            justifyContent = 'center'
            height = { 72 }
          >
            <InflexibleRow
              id = 'play-button'
              className = { `mdc-elevation--z1` }
              alignItems = 'center'
              justifyContent = 'center'
              width = { 56 }
              height = { 56 }
              borderRadius = { 48 }
              backgroundColor = 'var(--mdc-theme-accent)'
              color = 'var(--mdc-theme-background)'
              cursor = 'pointer'
            >
              <MaterialIcon>
                { buttonIcon }
              </MaterialIcon>
            </InflexibleRow>
          </InflexibleRow>

          { tabbedPaneDOM }
        </Column>
      )
    ),
    messages: Observable.merge(
      tabbedPane.messages,
      changePlaybackStatus$,
    )
  }
}