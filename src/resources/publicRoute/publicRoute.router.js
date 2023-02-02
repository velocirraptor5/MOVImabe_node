import { Router } from "express";
import { createOne, removeOne, updateOne } from "./publicRoute.controllers";

const router = Router();
import expressWs from 'express-ws'

const ws = expressWs(router)

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
    if (data.type === 'close') {
      s.close();
    }
    if (data.type === 'error') {
      s.error();
    }

    if (!data.payload) {
      s.send('no param payload in message');
      return
    }
    data.payload.user = req.user;

    if (data.type === 'create') {
      s.send('creating');
      createOne(data.payload).then((doc) => {
        console.log('doc', doc);
        s.send(JSON.stringify(doc));
      })

    }

    if (data.type === 'update') {
      s.send('updating');
      updateOne(data.payload).then((doc) => {
        console.log('doc', doc);
        s.send(JSON.stringify(doc));
      }
      )
    }

    if (data.type === 'remove') {
      s.send('deleting');
      removeOne(data.payload).then((doc) => {
        console.log('doc', doc);
        s.send(JSON.stringify(doc));
      }
      )
    }

    if (data.type === 'get') {
      s.send('getting');
      getOne(data.payload).then((doc) => {
        console.log('doc', doc);
        s.send(JSON.stringify(doc));
      }
      )
    }

    if (data.type === 'getMany') {
      s.send('getting many');
      getMany().then((doc) => {
        console.log('doc', doc);
        s.send(JSON.stringify(doc));
      }
      )
    }

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