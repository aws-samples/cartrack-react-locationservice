// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import * as React from 'react';

const ICON = 'm392.145 156.86c0 134.035-156.858 313.721-156.858 313.721s-156.857-176.754-156.857-313.721c0-86.631 70.229-156.86 156.861-156.86s156.86 70.229 156.86 156.86z'

function Pin(props) {
  const {size = 30} = props;

  return (
    <svg enable-background="new 0 0 470.581 470.581" height={size} viewBox="0 0 470.581 470.581" width={size} xmlns="http://www.w3.org/2000/svg">
      <path d="m392.145 156.86c0 134.035-156.858 313.721-156.858 313.721s-156.857-176.754-156.857-313.721c0-86.631 70.229-156.86 156.861-156.86s156.86 70.229 156.86 156.86z" fill="#ef5261"/>
      <circle cx="235.288" cy="153.83" fill="#eeefee" r="103.298"/>
    </svg>
  );
}

export default React.memo(Pin);