import { Router } from "express";
import { createOne, getMany, getOne, removeOne, updateOne } from "./publicRoute.controllers";

const router = Router();
import expressWs from 'express-ws'
import { type } from "express/lib/response";

const ws = expressWs(router)
const viajes = new Map();

// router.get('/', (req, res) => {
//   console.error('express connection');
//   res.send('hello world');
// });
router.ws('/', (s, req) => {
  s.send('conectado mi pana ');
  // console.log('socket connection mi pana');
  s.onopen = () => console.log('socket opened');
  s.onclose = () => console.log('socket closed');
  s.onerror = () => console.log('socket error');

  s.onmessage = (msg) => {
    console.log('socket message', msg);


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
          viajes.set(doc._id.toString(), s);
        })
        break;

      case 'update':
        s.send(JSON.stringify({ type: 'updating' }));
        updateOne(data.payload).then((doc) => {
          console.log('doc', doc);
          s.send(JSON.stringify({
            type: 'updated',
            payload: doc
          })
          );
        }
        )
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
        console.log('viajes', viajes);
        const viajeId = data.payload.body.id;
        console.log('viajeID', viajeId);
        console.log('type viajeID', typeof viajeId);
        const viaje = viajes.get(viajeId);
        viajes.forEach((v, k) => {
          console.log('k', k);
          console.log('type k ', typeof k);
          console.log('v', v);
        })
        console.log('viaje', viaje);
        console.log('viajeID', viajeId);
        if (viaje) {
          viaje.send(JSON.stringify({
            type: 'request seat',
            payload: data.payload
          }));
        }
      default:
        break;
    }
    // if (data.type === 'close') {
    //   s.close();
    // }
    // if (data.type === 'error') {
    //   s.error();
    // }


    // if (data.type === 'create') {
    //   s.send(JSON.stringify({ type: 'creating' }));
    //   createOne(data.payload).then((doc) => {
    //     console.log('doc', doc);
    //     s.send(JSON.stringify({
    //       type: 'created',
    //       payload: doc
    //     }));
    //   })

    // }

    // if (data.type === 'update') {
    //   s.send(JSON.stringify({ type: 'updating' }));
    //   updateOne(data.payload).then((doc) => {
    //     console.log('doc', doc);
    //     s.send(JSON.stringify({
    //       type: 'updated',
    //       payload: doc
    //     })
    //     );
    //   }
    //   )
    // }

    // if (data.type === 'remove') {
    //   s.send(JSON.stringify({ type: 'removing' }));
    //   removeOne(data.payload).then((doc) => {
    //     console.log('doc', doc);
    //     s.send(JSON.stringify({
    //       type: 'removed',
    //       payload: doc
    //     })
    //     );
    //   }
    //   )
    // }

    // if (data.type === 'get') {
    //   s.send(JSON.stringify({ type: 'getting' }));
    //   getOne(data.payload).then((doc) => {
    //     console.log('doc', doc);
    //     s.send(JSON.stringify({
    //       type: 'got',
    //       payload: doc
    //     })
    //     );
    //   }
    //   )
    // }

    // if (data.type === 'getMany') {
    //   s.send(JSON.stringify({ type: 'gettingMany' }));
    //   getMany().then((doc) => {
    //     console.log('doc', doc);
    //     s.send(JSON.stringify({
    //       type: 'gotMany',
    //       payload: doc
    //     })
    //     );
    //   }
    //   )
    // }

    // console.log('socket message', msg);
    // s.send('hello');
  }

});

// // api/publicRoute

// router
//   .route("/")
//   .get(controllers.getMany)
//   .post(controllers.createOne)

// // api/publicRoute/:id

// router
//   .route("/")
//   .get(controllers.getOne)
//   .put(controllers.updateOne)
//   .delete(controllers.removeOne)

export default router