"use server";

import { Readable } from "stream";
import prisma from "@/libs/prisma"; // tu instancia de prisma
import cloudinary from "@/libs/cloudinary";
import { ActionResponse, ImageSource } from "@/libs/definitions";
import { UploadApiResponse } from "cloudinary";

export async function createImage({
  formData,
  entityType,
  entityId,
}: {
  formData: FormData;
  entityType: string;
  entityId: string | undefined;
}): Promise<ActionResponse<unknown>> {
  const image = formData.get("image") as File;

  if (!image) {
    return {
      success: false,
      message: "La imagen no ha sido subida",
    };
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: entityType,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("No se recibió respuesta"));
          }
          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    // Guarda en la base de datos
    const saved = await prisma.image.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        entityType,
        entityId: entityId ?? "unknown",
      },
    });

    return {
      success: true,
      message: "Imagen subida correctamente",
      data: {
        url: saved.url,
        publicId: saved.publicId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al subir imagen",
    };
  }
}

export async function fetchImages({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: string | undefined;
}): Promise<ActionResponse<ImageSource[]>> {
  try {
    const findImage = await prisma.image.findMany({
      where: {
        entityType,
        entityId,
      },
    });

    if (!findImage) {
      return {
        success: false,
        message: "No se pudo carga la imagen",
      };
    }

    return {
      success: true,
      message: "Imagenes encontradas",
      data: findImage,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al cargar imágenes",
    };
  }
}

export async function removeImage({
  publicId,
}: {
  publicId: string | null;
}): Promise<ActionResponse<unknown>> {
  try {
    if (!publicId) {
      return {
        success: false,
        message: "Imagen no encontrada",
      };
    }

    const res = await cloudinary.uploader.destroy(publicId);

    if (res.result !== "ok") {
      return {
        success: false,
        message: "Error al remover imagen",
      };
    }

    await prisma.image.deleteMany({
      where: {
        publicId,
      },
    });
    return {
      success: true,
      message: "La imagen ha sido removida",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al subir imagen",
    };
  }
}
