const http = require('http');
const Mongo = require('./db/mongo');
const colors = require('colors');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('sentimentsl-analysis:server');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


class Server {

  constructor(app, http) {
    this.app = app;

    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use('/', indexRouter);
    this.app.use('/users', usersRouter);

    // cthis.atch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      next(createError(404));
    });

    // ethis.rror handler
    this.app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    this.port = this.normalizePort(process.env.PORT || '3000');
    this.app.set('port', this.port);


    this.server = http.createServer(this.app);

    this.server.listen(this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening.bind(this));

  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('-------------> server listening on', bind);
  }

  normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

}

new Server(express(), http);

