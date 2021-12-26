import RNBackgroundDownloader from "react-native-background-downloader";

export const getDownloadDestination = (filename: string): string => {
  return `${RNBackgroundDownloader.directories.documents}/${filename}`;
};
