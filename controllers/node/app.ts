import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { engine } from 'express-handlebars'
import helpers from 'handlebars-helpers'
import session from 'express-session'

import indexRouter from './routes/index'
import connectionRouter from './routes/connection'
import proofRouter from './routes/proof'
import walletRouter from './routes/wallet'
import webhookRouter from './routes/webhook'
import createError from 'http-errors'

declare module 'express-session' {
  export interface SessionData {
    wallet: any
  }
}

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('hbs', engine({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: [
    path.join(__dirname, '/views/partials'),
    path.join(__dirname, '/views/partials/connection'),
    path.join(__dirname, '/views/partials/home'),
    path.join(__dirname, '/views/partials/proof')
  ],
  helpers: helpers(['array', 'comparison'])
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'SuperSecretKey',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false
}))

app.use('/', indexRouter)
app.use('/connections', connectionRouter)
app.use('/proofs', proofRouter)
app.use('/wallets', walletRouter)
app.use('/webhooks', webhookRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
