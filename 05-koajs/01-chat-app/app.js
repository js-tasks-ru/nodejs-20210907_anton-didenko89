const path = require('path');
const Koa = require('koa');
const app = new Koa();

let clients = [];


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  ctx.set("Cache-Control", "no-cache,must-revalidate");

  const promise = new Promise(((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on("close", function () {
      clients = [];
      const error = new Error("Connection closed");
      error.code = "ECONNRESET";
      reject(error);
    });
  }))

  let message;

  try {
    message = await promise;
  } catch (error) {
    if (error.code === "ECONNRESET") return;
    throw error;
  }

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) return next();

  clients.forEach(function (resolve) {
    resolve(String(message));
  });

  clients = [];
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
