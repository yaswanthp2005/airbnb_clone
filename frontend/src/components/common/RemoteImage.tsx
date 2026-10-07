import Image, { type ImageProps } from "next/image";

import { OPTIMIZED_IMAGE_HOSTS } from "@/constants/images";

type RemoteImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
};

const isOptimizedHost = (src: string) => {
  try {
    return (OPTIMIZED_IMAGE_HOSTS as readonly string[]).includes(new URL(src).hostname);
  } catch {
    return false;
  }
};

/**
 * Hosts can paste photo URLs from anywhere; only known hosts go through the optimizer,
 * the rest load directly so an unknown domain can't break the page.
 */
const RemoteImage = ({ src, alt, ...props }: RemoteImageProps) => (
  <Image src={src} alt={alt} unoptimized={!isOptimizedHost(src)} {...props} />
);

export default RemoteImage;
