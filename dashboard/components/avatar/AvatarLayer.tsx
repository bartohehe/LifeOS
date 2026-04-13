// Sprint: implement Framer Motion layer with Image
export default function AvatarLayer({ src, zIndex, alt }: { src: string; zIndex: number; alt: string }) {
  return <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex }} aria-label={alt} />
}
