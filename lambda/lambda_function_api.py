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

TRACKER_NAME = "carTracker"

def handler(event, context):

  # load the side-loaded Amazon Location Service model; needed during Public Preview
  os.environ["AWS_DATA_PATH"] = os.environ["LAMBDA_TASK_ROOT"]

  client = boto3.client("location")
  #response = client.get_device_position(DeviceId="cartrack01", TrackerName="MyTracker")
  #print(response["DeviceId"])
  #print(response["Position"])
  
  now = datetime.datetime.now().isoformat()
  yesterday = (datetime.datetime.now() - timedelta(1)).isoformat()
  
  response = client.get_device_position_history(DeviceId="car01", TrackerName="carTracker", StartTimeInclusive=yesterday, EndTimeExclusive=now)
  print(response)

  #current_time = datetime.datetime.now().time()

  # body = {
  #     "message": "Hello cartrack, the current time is " + str(now)
  # }
  body = response['DevicePositions']

  response = {
      "statusCode": 200,
      # "body": json.dumps(body),
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