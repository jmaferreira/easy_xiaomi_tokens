const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const bt = require("ibackuptool");
const sqlite3 = require("sqlite3").verbose();

const TMP_PATH = "/tmp/easy_xiaomi_tokens";

main();

async function main() {
  let backupsList = await bt.run("backups.list");

  backupsList = backupsList.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const backupId = backupsList[0].udid;

  await bt.run("backup.files", {
    backup: backupId,
    extract: TMP_PATH,
    filter: "mihome.sqlite",
  });

  let backupFiles = await fs.readdir(
    path.join(TMP_PATH, "/App/com.xiaomi.mihome/Documents")
  );

  backupFiles = backupFiles.filter((filename) => {
    return /^\d+_mihome\.sqlite$/.test(filename);
  });

  let allDevices = [];
  for (backupFile of backupFiles) {
    console.debug("Opening backup file", backupFile);
    let dbfile = path.join(
      TMP_PATH,
      "/App/com.xiaomi.mihome/Documents",
      backupFile
    );
    const db = new sqlite3.Database(dbfile);
    const devicesTmp = await getDevicesFromDB(db);

    let devices = devicesTmp.map((v) => {
      return { encryptedToken: v.ZTOKEN, name: v.ZNAME, address: v.ZLOCALIP };
    });

    allDevices = [
      ...allDevices,
      ...devicesTmp.map((v) => {
        return { encryptedToken: v.ZTOKEN, name: v.ZNAME, address: v.ZLOCALIP };
      }),
    ];
  }

  for (let device of allDevices) {
    let token = await (
      await exec(
        `echo "0: ${device.encryptedToken}" | xxd -r -p | openssl enc -d -aes-128-ecb -nopad -nosalt -K 00000000000000000000000000000000`
      )
    ).stdout;

    device.token = token.substr(0, 32);
  }

  console.log(allDevices);
}

function getDevicesFromDB(db) {
  return new Promise((resolve, reject) => {
    const queries = [];
    db.each(
      `select ZTOKEN, ZLOCALIP, ZNAME from ZDEVICE;`,
      (err, row) => {
        if (err) {
          reject(err); // optional: you might choose to swallow errors.
        } else {
          queries.push(row); // accumulate the data
        }
      },
      (err, n) => {
        if (err) {
          reject(err); // optional: again, you might choose to swallow this error.
        } else {
          resolve(queries); // resolve the promise
        }
      }
    );
  });
}
