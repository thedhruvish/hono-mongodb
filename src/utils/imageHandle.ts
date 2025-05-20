import { Base64 } from "js-base64";
import { ImageKitUploadResponse } from "../types/imagekit";

/**
 * Extracts and processes the image file from the request context.
 * @param formData The parsed form data from the request
 * @returns { file: File; blob: Blob; filename: string; contentType: string }
 */
export async function handleImageFromForm(
  formData: Record<string, any>
): Promise<{ file: File; blob: Blob; filename: string; contentType: string }> {
  const file = formData["file"] as File;
  if (!file) throw new Error("No file provided in form data");
  const filename = file.name;
  const contentType = file.type;
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: contentType });
  return { file, blob, filename, contentType };
}

/**
 * Uploads a file to ImageKit using the provided Blob and credentials.
 * @param blob The Blob to upload
 * @param filename The name of the file
 * @param privateKey The ImageKit private API key
 * @returns Promise<ImageKitUploadResponse>
 */
export async function uploadToImageKit(
  blob: Blob,
  filename: string,
  privateKey: string
): Promise<ImageKitUploadResponse> {
  const uploadForm = new FormData();
  if (!privateKey) throw new Error("privateKey is required");

  uploadForm.append("file", blob);
  uploadForm.append("fileName", filename);
  const authHeader = "Basic " + Base64.encode(privateKey + ":");
  const uploadRes = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: uploadForm,
    }
  );
  if (!uploadRes.ok) {
    throw new Error(`ImageKit upload failed: ${uploadRes.statusText}`);
  }
  return await uploadRes.json();
}
