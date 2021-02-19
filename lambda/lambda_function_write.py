import sys
from pip._internal import main

main(['install', '-I', '-q', 'boto3', '--target', '/tmp/', '--no-cache-dir', '--disable-pip-version-check'])
sys.path.insert(0,'/tmp/')

from datetime import datetime
import json
import os

import boto3

# Update this to match the name of your Tracker resource
TRACKER_NAME = "carTracker"

def lambda_handler(event, context):
  # load the side-loaded Amazon Location Service model; needed during Public Preview
  os.environ["AWS_DATA_PATH"] = os.environ["LAMBDA_TASK_ROOT"]

  print(event)

  updates = [
    {
      "DeviceId": event["deviceid"],
      "SampleTime": datetime.fromtimestamp(event["timestamp"]).isoformat(),
      "Position": [
        event["lon"],
        event["lat"]
      ]
    }
  ]
  
  print(updates)

  client = boto3.client("location")
  response = client.batch_update_device_position(TrackerName=TRACKER_NAME, Updates=updates)
  
  return {
    "statusCode": 200,
    "body": json.dumps(response)
  }

