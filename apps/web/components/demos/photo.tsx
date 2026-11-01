import Image from "next/image";

/** A licensed photograph from public/demo (credits in public/demo/credits.json, shown on /about). */
export function Photo({ name, alt, sizes = "(min-width: 768px) 50vw, 100vw" }: { name: string; alt: string; sizes?: string }) {
  return (
    <Image
      src={`/demo/${name}.jpg`}
      alt={alt}
      width={1600}
      height={1067}
      sizes={sizes}
      draggable={false}
      className="size-full object-cover select-none"
    />
  );
}
