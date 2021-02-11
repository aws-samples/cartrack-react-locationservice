// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import * as React from 'react';

function ControlPanel(props) {
  return (
    <div className="control-panel">
      <h3>Device Information</h3>

      {props.deviceid ? (
        <div><strong>Device ID:</strong> {props.deviceid} </div>
      ) : (
          <div><strong>Device ID:</strong> loading... </div>
        )}

      {props.points ? (
        <div><strong># Points (last 24hrs):</strong> {props.points} </div>
      ) : (
          <div><strong>Points:</strong> loading... </div>
        )}

      {props.points ? (
        <div><strong>Last Point:</strong> {props.lastpointtime} </div>
      ) : (
          <div><strong>Last Point:</strong> loading... </div>
        )}

    </div >
  );
}

export default React.memo(ControlPanel);