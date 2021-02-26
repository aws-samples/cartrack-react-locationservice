# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0 

import sys
from pip._internal import main

main(['install', '-I', '-q', 'boto3', '--target', '/tmp/', '--no-cache-dir', '--disable-pip-version-check'])
sys.path.insert(0,'/tmp/')

import datetime
from datetime import timedelta
import os
import boto3
import json
import datetime

TRACKER_NAME = "MySampleTracker"
DEVICE_ID = "car01"

def handler(event, context):
  os.environ["AWS_DATA_PATH"] = os.environ["LAMBDA_TASK_ROOT"]

  client = boto3.client("location")  
  now = datetime.datetime.now().isoformat()
  yesterday = (datetime.datetime.now() - timedelta(1)).isoformat()
  
  try:
    gps_data = client.get_device_position_history(DeviceId=DEVICE_ID, TrackerName=TRACKER_NAME, StartTimeInclusive=yesterday, EndTimeExclusive=now)
    body = gps_data["DevicePositions"]
  except:
    body = ""
    print ("Error getting Device Position History")

  response = {
      "statusCode": 200,
      "body": json.dumps(body, indent=4, sort_keys=True, default=str),
      'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      },
  }

  return response
