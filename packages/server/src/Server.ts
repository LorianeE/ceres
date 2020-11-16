import {GlobalAcceptMimesMiddleware, Configuration, PlatformApplication, Inject} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import express from "express";
import favicon from "serve-favicon";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import "@tsed/platform-express";
import * as path from "path";
import * as dotenv from "dotenv";
import session from "express-session";

import {CreateRequestSessionMiddleware} from "./middlewares/CreateRequestSessionMiddleware";
import User from "./models/User";

dotenv.config();

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/build");

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
        useUnifiedTopology: true
      }
    }
  ]
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

    this.app.use(CreateRequestSessionMiddleware);

    return null;
  }

  $afterRoutesInit() {
    const indexMiddleware = (req: any, res: any) => {
      if (!res.headersSent) {
        res.set({
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          expires: "0"
        });
      }
      res.sendFile(path.join(clientDir, "index.html"));
    };

    const app = this.app;

    app.get("/", indexMiddleware);
    app.use("/", express.static(clientDir));
    app.get("/*", indexMiddleware);
  }
}
