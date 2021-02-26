// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react'
import { Signer } from "@aws-amplify/core";
import { ICredentials } from "aws-amplify";
import ReactMapGL, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl'
import amplifyConfig from "./aws-exports";
import Amplify, { Auth, API } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react'
import './App.css';
import './MarkerStyle.css'
import TopBar from './topBar';
import ControlPanel from './ControlPanel'

Amplify.configure(amplifyConfig);
API.configure(amplifyConfig);

// Replace with the name of the map that you created on the Amazon Location Service console: https://console.aws.amazon.com/location/maps/home?region=us-east-1#/
const mapName = "MyMap";
const apiName = "blogfinal"
const apiPath = "/items"

const App = () => {
  const [credentials, setCredentials] = useState(ICredentials);

  const [deviceid, setDeviceid] = useState(null)
  const [points, setPoints] = useState(0)
  const [lastpoint, setLastpoint] = useState(null)

  const [viewport, setViewport] = useState({
    longitude: -46,
    latitude: -23,
    width: "100vw",
    height: "100vh",
    zoom: 7,
    bearing: 0,
    pitch: 0,
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    minZoom: 1.5,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85
  });

  //style variables
  const fullscreenControlStyle = {
    top: 36,
    left: 0,
    padding: '10px'
  };

  const navStyle = {
    top: 72,
    left: 0,
    padding: '10px'
  };

  const scaleControlStyle = {
    bottom: 36,
    left: 0,
    padding: '10px'
  };

  const geolocateStyle = {
    top: 0,
    left: 0,
    padding: '10px'
  };

  //state to store GPS Points from AWS Location Services
  const [gpspoints, setGpspoints] = useState([])

  useEffect(() => {
    async function fetchCredentials() {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();
  }, []);

  /**
   * Sign requests made by Mapbox GL using AWS SigV4.
   */
  const transformRequest = (props) => (url, resourceType) => {
    // Resolve to an AWS URL
    if (resourceType === "Style" && !url?.includes("://")) {
      url = `https://maps.geo.${amplifyConfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    // Only sign AWS requests (with the signature as part of the query string)
    if (url?.includes("amazonaws.com")) {
      return {
        url: Signer.signUrl(url, {
          access_key: props.accessKeyId,
          secret_key: props.secretAccessKey,
          session_token: props.sessionToken,
        }),
      };
    }

    // Don't sign
    return { url: url || "" };
  };


  function renderMarker(station, i) {
    const { Position, ReceivedTime, SampleTime } = station;
    return (
      <Marker
        key={i}
        longitude={Position[0]}
        latitude={Position[1]}
        captureDrag={false}
        captureDoubleClick={false}
      >
        <div className="station">
          <span>&nbsp;Lng: {Position[0]} | </span>
          <span>&nbsp;Lat: {Position[1]} | </span>
          <span>&nbsp;{SampleTime} </span>
        </div>
      </Marker>
    );
  }

  async function getData() {
    try {
      const data = await API.get(apiName, apiPath)
      //console.log('data from Lambda REST API: ', data)

      //write the data to "gpspoints" state
      console.log(data)
      setGpspoints(data)
      setDeviceid(data[0].DeviceId)
      setPoints(data.length)
      setLastpoint(data[data.length - 1].SampleTime);
      setViewport({
        ...viewport,
        longitude: data[0].Position[0],
        latitude: data[0].Position[1],
        zoom: 14
      })
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // Function Return
  return (
    <div>
      {credentials ? (
        <ReactMapGL
          {...viewport}
          transformRequest={transformRequest(credentials)}
          mapStyle={mapName}
          onViewportChange={setViewport}
        >

          { gpspoints.map(renderMarker)}

          <TopBar
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
          />
          <NavigationControl style={navStyle} showCompass={false} />
          <GeolocateControl style={geolocateStyle} />
          <FullscreenControl style={fullscreenControlStyle} />
          <ScaleControl style={scaleControlStyle} />
          <ControlPanel deviceid={deviceid} points={points} lastpointtime={lastpoint} />

        </ReactMapGL>
      ) : (
          <h1>Loading Map Credentials, please wait...</h1>
        )}
    </div>
  );
};

export default App;
//to insert the authentication comment the above line and uncomment the following line
//export default withAuthenticator(App);
