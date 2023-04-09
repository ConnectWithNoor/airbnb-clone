"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhoto, TbPhotoPlus, TbPhotoUp } from "react-icons/tb";

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function ImageUpload({ onChange, value }: Props) {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
        relative cursor-pointer hover:opacity-70 transition border-dashed p-20 border-neutral-300 flex flex-col justify-center
        items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={value}
                  className="object-contain"
                  alt="upload"
                  fill
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;
