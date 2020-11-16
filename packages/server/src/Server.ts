import {GlobalAcceptMimesMiddleware, Configuration, PlatformApplication, Inject, Res} from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import * as path from "path";
import * as dotenv from "dotenv";
import * as session from "express-session";
import * as favicon from "serve-favicon";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import "@tsed/platform-express";

import {User} from "./models/User";
import {ServerResponse} from "http";
import {join} from "path";
const send = require("send");

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
    `${rootDir}/protocols/*{.ts,.js}` // scan protocols directory
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
  }
})
export class Server {
  @Inject()
  app: PlatformApplication<Express.Application>;

  $beforeRoutesInit() {
    this.app
      .use(cors())
      .use(favicon(path.join(clientDir, "favicon.ico")))
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(
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
      );

    return null;
  }

  $afterRoutesInit() {
    this.app.get(`/*`, (req: any, res: Res) => {
      res.sendFile(join(clientDir, "index.html"));
    });
  }
}
