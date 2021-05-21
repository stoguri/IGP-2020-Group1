import React from 'react';

import socketio from "socket.io-client";

export const socket = socketio.connect('https://chungus.co.uk:8080');

export const SocketContext = React.createContext()