import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication, Res} from "@tsed/common";
import "@tsed/mongoose";
import "@tsed/platform-express";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import {ServerResponse} from "http";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path, {join} from "path";
import "./formats/UriFormat";

import {User} from "./models/User";

const send = require("send");
const mongooseStore = require("cache-manager-mongoose");

dotenv.config();

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/build");

function setCustomCacheControl(res: ServerResponse, path: string) {
  if (send.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("expires", "0");
  }
}

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`]
  },
  componentsScan: [
    `${rootDir}/protocols/*.ts` // scan protocols directory
  ],
  passport: {
    userInfoModel: User
  },
  swagger: [
    {
      path: "/docs"
    }
  ],
  exclude: ["**/*.spec.ts"],
  mongoose: [
    {
      id: "default",
      url: process.env.NODE_ENV === "production" ? String(process.env.MONGO_DB_URL) : "mongodb://localhost:27017/Ceres",
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    }
  ],
  statics: {
    "/": [
      {
        root: clientDir,
        maxAge: "1d",
        setHeaders: setCustomCacheControl
      }
    ]
  },
  middlewares: [
    cors(),
    // favicon(path.join(clientDir, "favicon.ico")),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    }),
    session({
      secret: process.env.SESSION_SECRET || "mydefaultsecret",
      resave: true,
      saveUninitialized: true,
      // maxAge: 36000,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: undefined
      }
    })
  ],
  cache: {
    ttl: 300, // default TTL
    store: mongooseStore,
    mongoose,
    modelOptions: {
      collection: "caches",
      versionKey: false
    }
  }
})
export class Server {
  @Inject()
  app: PlatformApplication<Express.Application>;

  $afterRoutesInit() {
    this.app.get(`/*`, (req: any, res: Res) => {
      res.sendFile(join(clientDir, "index.html"));
    });
  }
}
