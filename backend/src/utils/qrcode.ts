import QRCode from "qrcode";

export const generateQRCode = async (
  registrationId: string,
): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(registrationId, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrDataURL;
  } catch (error) {
    throw new Error("QR Code generation failed");
  }
};
