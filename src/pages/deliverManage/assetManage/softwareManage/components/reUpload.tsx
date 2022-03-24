import React, { useCallback, useEffect, useState } from "react";
import style from "@emotion/styled/macro";
import axios from "axios";
import { Loading, Upload } from "tdesign-react";
import {
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
} from "tdesign-icons-react";

const UploadContent = style.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type MyLoadProps = {
  softWareId: number;
};
export const MyUpload: React.FC<MyLoadProps> = (props: MyLoadProps) => {
  const [progress, setProgress] = useState<number>(0); //上传进度
  const [uploadStep, setUploadStep] = useState<number>(0); // 0 未上传  1百分比  2成功 -1失败
  const [successId, setSuccessId] = useState<any>("");
  const [fileName, setFileName] = useState<string>("");
  const [errText, setErrText] = useState<any>(""); //上传返回的错误信息

  const beforeUpload = useCallback(async (file) => {
    setUploadStep(1);
    setFileName(file.name);
    return true;
  }, []);

  const onProgress = useCallback((val) => {
    console.log("progress--res", val);
    setProgress(val.percent);
  }, []);

  //@ts-ignore
  const handleFail = ({ file }) => {
    setUploadStep(-1);
    console.log("fail---res", file);
  };

  const handleSuccess = useCallback((res) => {
    console.log("success--res", res);
    if (res.response.code === 0) {
      setErrText("");
      setUploadStep(2);
      setSuccessId(res.response.result);
    } else {
      setErrText(res.response?.msg);
      setUploadStep(-1);
      setSuccessId("");
    }
    setFileName(res.file.name);
  }, []);
  const uploadText = () => {
    switch (uploadStep) {
      case 0:
        return;
        break;

      case 1:
        return (
          <div>
            <span>{fileName}</span>
            <Loading style={{ width: 20, height: 20 }}></Loading>
            <span style={{ marginLeft: 10, color: "rgb(16, 93, 219)" }}>
              {progress + " "}%
            </span>
          </div>
        );
        break;

      case 2:
        return (
          <div>
            {" "}
            <span>{fileName}</span>
            <CheckCircleFilledIcon style={{ marginLeft: 10, color: "rgb(0, 168, 112)" }} />
          </div>
        );
        break;

      case -1:
        return <span style={{color:'red'}}>上传失败，请重新上传!</span>
        break;
      default:
        break;
    }
  };
  return (
    <UploadContent>
      <div style={{textAlign:'center'}}>
        <Upload
          action={
            `${axios.defaults.baseURL}` + "/software/uploadFile"
          }
          showUploadProgress
          theme="custom"
          beforeUpload={beforeUpload}
          onProgress={onProgress}
          onFail={handleFail}
          onSuccess={handleSuccess}
          data={{
            softwareId:10000000000
          }}
        ></Upload>

        <div>
        {uploadText()}
        </div>
      </div>
    </UploadContent>
  );
};
