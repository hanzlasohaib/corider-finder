import home640 from "../assets/photos/home-ride-640.webp";
import home960 from "../assets/photos/home-ride-960.webp";
import home1280 from "../assets/photos/home-ride-1280.webp";
import auth400 from "../assets/photos/auth-approach-400.webp";
import auth640 from "../assets/photos/auth-approach-640.webp";

const PHOTOS = {
  home: {
    src: home960,
    srcSet: `${home640} 640w, ${home960} 960w, ${home1280} 1280w`,
    sizes: "(max-width: 768px) 100vw, 36rem",
    width: 1280,
    height: 720,
    alt: "Two students on a motorcycle leaving a Pakistani university campus",
  },
  auth: {
    src: auth640,
    srcSet: `${auth400} 400w, ${auth640} 640w`,
    sizes: "(max-width: 1024px) 100vw, 40vw",
    width: 640,
    height: 853,
    alt: "University courtyard with parked student bikes and people walking",
  },
};

export default function PublicPhoto({
  kind,
  className = "",
  imgClassName = "",
  priority = false,
}) {
  const photo = PHOTOS[kind];

  return (
    <div className={`overflow-hidden bg-stone-200 ${className}`}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={photo.sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? "eager" : "lazy"}
        className={`block h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
