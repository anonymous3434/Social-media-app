import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../button";
type FileUploaderType = {
  mediaUrl: string;
  fieldChange: (files: File[]) => void;
};
const FileUploader = ({ mediaUrl, fieldChange }: FileUploaderType) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      {...getRootProps()}
      className="flex bg-dark-3 flex-center rounded-xl cursor-pointer flex-col"
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <>
          <div className="relative w-full pb-[100%] rounded-lg overflow-hidden">
            <img
              src={fileUrl}
              alt="post"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          </div>
          <p className="text-light-3">Click or drag photo to replace</p>
        </>
      ) : (
        <>
          <div className="file_uploader-box gap-2">
            <img src="/assets/icons/file-upload.svg" alt="file-upload" />
            <h3 className="text-light-2 mt-2">Drag photos here</h3>
            <p className="text-light-4 small-regular mt-2">SVG,JPEG,PNG</p>
            <Button type="button" className="bg-dark-4">
              Select from device
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
