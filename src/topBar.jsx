// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import './topBar.css'

function src(props) {
  return (
    <div className='sidebarStyle'>
      <div>&nbsp;&nbsp;<strong>Longitude:</strong> {props.longitude} <strong>| Latitude:</strong> {props.latitude} <strong>| Zoom:</strong> {props.zoom}&nbsp;&nbsp;</div>
    </div>
  )
}

export default src;