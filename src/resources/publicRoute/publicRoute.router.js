import { Router } from "express";
import { createOne, getMany, getOne, getRoute, removeOne, updateOne } from "./publicRoute.controllers";

const router = Router();
import expressWs from 'express-ws'
import { type } from "express/lib/response";

const ws = expressWs(router)
const publicViajes = new Map();
const connections = new Map();

router.ws('/', (s, req) => {

  connections.set(req.user._id.toString(), s);

  s.send('conectado mi pana ');
  // console.log('socket connection mi pana');
  s.onopen = () => console.log('socket opened');
  s.onclose = () => {
    console.log('socket closed');
    connections.delete(req.user._id.toString());
  };

  s.onerror = () => console.log('socket error');

  s.onmessage = (msg) => {
    console.log('socket message', msg);

    if (msg.data === 'ping') {
      s.send('pong');
      return
    }
    try {
      JSON.parse(msg.data);
    } catch (e) {
      console.error(e);
      s.send('el mensaje no es json ' + e.message);
      return
    }

    const data = JSON.parse(msg.data);

    if (!data.type) {
      s.send('no param type in message');
      return
    }

    if (!data.payload) {
      s.send('no param payload in message');
      return
    }

    data.payload.user = req.user;
    switch (data.type) {
      case 'close':
        s.close();
        break;
      case 'error':
        s.error();
        break;

      case 'create':
        s.send(JSON.stringify({ type: 'creating' }));
        createOne(data.payload).then((doc) => {
          console.log('doc', doc);
          s.send(JSON.stringify({
            type: 'created',
            payload: doc
          }));
          publicViajes.set(doc._id.toString(), s);
        })
        break;

      case 'update':
        s.send(JSON.stringify({ type: 'updating' }));
        updateOne(data.payload).then((doc) => {
          console.log('doc', doc);
          connections.forEach((s, id) => {
            s.send(JSON.stringify({
              type: 'updated',
              payload: doc
            }));
          }
          )
        });
        break;

      case 'remove':
        s.send(JSON.stringify({ type: 'removing' }));
        removeOne(data.payload).then((doc) => {
          console.log('doc', doc);
          s.send(JSON.stringify({
            type: 'removed',
            payload: doc
          })
          );
        }
        )
        break;

      case 'get':
        s.send(JSON.stringify({ type: 'getting' }));
        getOne(data.payload).then((doc) => {
          console.log('doc', doc);
          s.send(JSON.stringify({
            type: 'got',
            payload: doc
          })
          );
        }
        )
        break;

      case 'getMany':
        s.send(JSON.stringify({ type: 'gettingMany' }));
        getMany(data.payload).then((doc) => {
          console.log('doc', doc);
          s.send(JSON.stringify({
            type: 'gotMany',
            payload: doc
          })
          );
        }
        )
        break;

      case 'request seat':
        s.send(JSON.stringify({ type: 'requesting seat' }));
        const publicViajeId = data.payload.body.id;
        const wsPublicViaje = publicViajes.get(publicViajeId);
        const routeID = data.payload.body.route;
        getRoute(routeID).then((doc) => {
          if (wsPublicViaje) {
            wsPublicViaje.send(JSON.stringify({
              type: 'request seat',
              payload: {
                _id: data.payload.user._id,
                nikname: data.payload.user.nikname,
                email: data.payload.user.email,
                route: doc?.data
              }
            }));
          }
          else {
            s.send(JSON.stringify({
              type: 'request seat',
              payload: {
                message: 'no existe el viaje'
              }
            }));
          }
        })
        break;

      default:
        break;
    }
  }
});


export default router