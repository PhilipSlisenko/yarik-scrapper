import { ScrapperAfm } from "./scrappers/scrapperAfm.js";
import { ScrapperAllSpares } from "./scrappers/scrapperAllSpares.js";
import { ScrapperArtMobile } from "./scrappers/scrapperArtMobile.js";
import { ScrapperFlatCable } from "./scrappers/scrapperFlatCable.js";
import { ScrapperGsmForsage } from "./scrappers/scrapperGsmForsage.js";
import { ScrapperTPlus } from "./scrappers/scrapperTPlus.js";
import { ScrapperUptel } from "./scrappers/scrapperUptel.js";
import { ScrapperWelcomeMobi } from "./scrappers/scrapperWelcomeMobi.js";
import { IScheduleItemp, IScrappersInfo } from "./types";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";

interface IConfig {
  scrappersToRun: IScrappersInfo[];
  schedule: IScheduleItemp[];
  outputFileKey: string;
  shopsCredentials: IShopsCredentials;
}

interface IShopsCredentials {
  usernameAfm: string;
  passwordAfm: string;
  usernameAllSpares: string;
  passwordAllSpares: string;
  usernameArtMobile: string;
  passwordArtMobile: string;
  usernameFlatCable: string;
  passwordFlatCable: string;
  usernameTPlus: string;
  passwordTPlus: string;
  usernameUptel: string;
  passwordUptel: string;
  usernameGsmForsage: string;
  passwordGsmForsage: string;
  usernameWelcomeMobi: string;
  passwordWelcomeMobi: string;
}

const getShopsCredentialsFromS3 = async (bucket: string, fileKey: string) => {
  const objectInfo = {
    Bucket: bucket,
    Key: fileKey,
  };
  try {
    const s3ClientConfig = {
      region: "eu-central-1",
    };
    const s3Client = new S3Client(s3ClientConfig);
    const data = await s3Client.send(new GetObjectCommand(objectInfo));
    if (data.Body === undefined) {
      throw new Error(`Failed to download ${objectInfo} from s3.`);
    }
    const contents = await data.Body.transformToString();
    return JSON.parse(contents);
  } catch (error) {
    console.log("CRITICAL Failed to load shops credentials config from s3");
  }
};

const getMainConfig = async (): Promise<IConfig> => {
  const shopsCredentials = await getShopsCredentialsFromS3(
    "parser-yarik",
    "shopsCredentials.json"
  );
  return {
    scrappersToRun: [
      { name: "Afm", class_: ScrapperAfm },
      { name: "AllSpares", class_: ScrapperAllSpares },
      { name: "ArtMobile", class_: ScrapperArtMobile },
      { name: "FlatCable", class_: ScrapperFlatCable },
      // { name: "TPlus", class_: ScrapperTPlus },
      { name: "GsmForsage", class_: ScrapperGsmForsage },
      { name: "WelcomeMobi", class_: ScrapperWelcomeMobi },
      { name: "Uptel", class_: ScrapperUptel },
    ],
    schedule: [
      // displays - mobile phones
      {
        categoryId: 121,
        startDate: new Date("2023-01-30"),
        intervalInDays: 3,
      },
      {
        categoryId: 56,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 221,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 58,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 529,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 814,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 935,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 944,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 946,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 948,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 947,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 652,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      // displays - tablets
      {
        categoryId: 515,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 236,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
      {
        categoryId: 235,
        startDate: new Date("2023-02-25"),
        intervalInDays: 4,
      },
    ],
    outputFileKey: "parsing-results/outputXml.xml",
    shopsCredentials,
  };
};

const getDevConfig = async (): Promise<IConfig> => {
  const shopsCredentials = await getShopsCredentialsFromS3(
    "parser-yarik",
    "shopsCredentials.json"
  );
  return {
    scrappersToRun: [
      // { name: "Afm", class_: ScrapperAfm },
      // { name: "AllSpares", class_: ScrapperAllSpares },
      // { name: "ArtMobile", class_: ScrapperArtMobile },
      // { name: "FlatCable", class_: ScrapperFlatCable },
      { name: "TPlus", class_: ScrapperTPlus },
      // { name: "Uptel", class_: ScrapperUptel },
      { name: "GsmForsage", class_: ScrapperGsmForsage },
      { name: "WelcomeMobi", class_: ScrapperWelcomeMobi },
    ],
    schedule: [
      // {
      //   categoryId: 54,
      //   startDate: new Date("2023-01-10"),
      //   intervalInDays: 1,
      // },
      {
        categoryId: 121,
        startDate: new Date("2023-01-28"),
        intervalInDays: 1,
      },
    ],
    outputFileKey: "parsing-results/outputXml.xml",
    shopsCredentials,
  };
};

const getLocalCredentials = (filePath: string) => {
  const contents = fs.readFileSync(filePath).toString();
  return JSON.parse(contents);
};

const getLocalConfig = (): IConfig => {
  return {
    scrappersToRun: [
      // { name: "Afm", class_: ScrapperAfm },
      // { name: "AllSpares", class_: ScrapperAllSpares },
      // { name: "ArtMobile", class_: ScrapperArtMobile },
      // { name: "FlatCable", class_: ScrapperFlatCable },
      // { name: "TPlus", class_: ScrapperTPlus },
      // { name: "Uptel", class_: ScrapperUptel },
      // { name: "GsmForsage", class_: ScrapperGsmForsage },
      { name: "WelcomeMobi", class_: ScrapperWelcomeMobi },
    ],
    schedule: [
      // {
      //   categoryId: 54,
      //   startDate: new Date("2023-01-10"),
      //   intervalInDays: 1,
      // },
      {
        categoryId: 121,
        startDate: new Date("2023-01-28"),
        intervalInDays: 1,
      },
    ],
    outputFileKey: "parsing-results/outputXml.xml",
    shopsCredentials: getLocalCredentials(
      "/Users/philip/Documents/projects/parser/src/shopsCredentials.json"
    ),
  };
};

export let config: IConfig;

export const instantiateConfig = async () => {
  console.log(
    `INFO Instantiating config for NODE_ENV: "${process.env.NODE_ENV}"`
  );
  if (process.env.NODE_ENV === "main") {
    config = await getMainConfig();
  } else if (process.env.NODE_ENV === "dev") {
    config = await getDevConfig();
  } else {
    config = getLocalConfig();
  }
};
