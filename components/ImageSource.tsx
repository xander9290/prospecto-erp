"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  createImage,
  fetchImages,
  removeImage,
} from "@/app/actions/image-source-actions";

type TImageProps = {
  entityType: string;
  entityId: string | undefined;
  getUrl?: (url: string) => void;
};

type TImageSource = {
  url: string | null;
  publicId: string | null;
};

function ImageSource({ entityType, entityId, getUrl }: TImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSource, setImageSource] = useState<TImageSource>({
    url: null,
    publicId: null,
  });

  const handleRemoveImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await removeImage({ publicId: imageSource.publicId });
    setImageSource({ url: null, publicId: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageSource.url !== null) {
      toast.error("Elimina la imagen actual para editar");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading("Subiendo imagen", {
        position: "bottom-right",
      });
      const objectUrl = URL.createObjectURL(file);
      setImageSource({
        url: objectUrl,
        publicId: "",
      });
      const formData = new FormData();
      formData.append("image", file);
      const res = await createImage({ formData, entityType, entityId });
      if (res.success) {
        const { url, publicId } = res.data as TImageSource;
        setImageSource({ url, publicId });
        toast.success(res.message, { id: toastId });
        if (getUrl) {
          getUrl(url ?? "");
        }
      } else {
        toast.error(res.message, { id: toastId });
      }
    }
  };

  const getImages = async () => {
    const res = await fetchImages({ entityType, entityId });
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    if (res.data) {
      const getImage = res.data[0];
      const url = getImage?.url ?? null;
      const publicId = getImage?.publicId ?? null;

      setImageSource({ url, publicId });
    }
  };

  useEffect(() => {
    getImages();
  }, [entityType, entityId]);

  return (
    <figure
      role="button"
      onClick={() => fileInputRef.current?.click()}
      className="position-relative d-inline-block figure"
    >
      <Image
        src={imageSource.url ?? "/image/avatar_default.svg"}
        alt="user_image"
        className="figure-img img-fluid img-thumbnail rounded"
        width={200}
        height={200}
        unoptimized
        style={{
          cursor: "pointer",
          objectFit: "cover", // Hace que la imagen se recorte para llenar el contenedor
          width: "200px",
          height: "200px",
        }} // Cambia el cursor para indicar que es clickeable
      />
      {imageSource.url && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="btn btn-danger btn-sm rounded-circle position-absolute"
          style={{
            top: "-8px",
            right: "-8px",
            width: "24px",
            height: "24px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
          }}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      )}
      <Form.Control
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImage}
        className="d-none" // Oculta el input
      />
    </figure>
  );
}

export default ImageSource;
