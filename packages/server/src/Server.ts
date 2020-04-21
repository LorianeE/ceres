import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import * as path from "path";

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/build");

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`],
  },
  swagger: [
    {
      path: "/docs",
    },
  ],
  exclude: ["**/*.spec.ts"],
  mongoose: {
    urls: {
      default: {
        // Recommended: define default connection. All models without dbName will be assigned to this connection
        url: process.env.MONGO_DB_URL || "mongodb://localhost:27017/Ceres",
        connectionOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
    },
  },
  statics: {
    "/": clientDir
  }
})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    this.use(cors())
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      );

    return null;
  }
}
