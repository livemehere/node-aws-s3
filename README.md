# S3 환경변수

### .env

반드시 아래의 이름으로 설정해야하고, aws-sdk 는 따로 명시하지 않아도 자동으로 credetial을 환경변수에서 참조하기 때문에 env에 작성해두고, S3객체 생성시 config를 별도로 명시해줄 필요가 없다.

> 반드시 아래의 환경변수 이름이어야한다. 또 필요한 환경변수가 있다면 공식문서에 나와있으니 찾아보고 사용해야한다.

[Javascript SDK 구성](https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

### index.html

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <div class="grid">
    <input type="file" multiple name="files" />
    <input type="submit" />
  </div>
</form>
```

### index.js

```js
//  ES Module 시스템에서 dirname, filename 이 사라짐
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경변수
import "dotenv/config";

import express from "express";

// S3 파일 업로드를 위한 모듈 3개 설치
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const app = express();
const s3 = new S3Client(); // 환경변수는 모두 자동 참조됨으로 별도 config 입력 하지 않음

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 업로드 API
app.post("/upload", upload.array("files"), (req, res, next) => {
  console.log(req.files);
  res.send("Successfully uploaded " + req.files.length + " files!");
});

app.listen(3000, () => {
  console.log("server running on 3000");
});
```
