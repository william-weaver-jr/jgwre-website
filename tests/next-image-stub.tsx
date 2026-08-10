/**
 * A stand-in for `next/image`.
 *
 * The real component needs the loader and the static-import metadata that only
 * the Next build produces — under Vite a `.jpg` import is a plain URL string,
 * and `<Image>` throws on the missing intrinsic width. The Next-only props are
 * dropped rather than forwarded, since React warns on non-boolean attributes
 * like `priority` reaching the DOM.
 *
 * `src` and `alt` survive intact, which is what the suites actually assert.
 */
type StubProps = {
  src: string | { src: string };
  alt: string;
  priority?: boolean;
  placeholder?: string;
  blurDataURL?: string;
  quality?: number;
  fill?: boolean;
  loader?: unknown;
  unoptimized?: boolean;
  className?: string;
  sizes?: string;
};

export function NextImageStub({
  src,
  alt,
  priority: _priority,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  quality: _quality,
  fill: _fill,
  loader: _loader,
  unoptimized: _unoptimized,
  ...rest
}: StubProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={typeof src === "string" ? src : src.src} alt={alt} {...rest} />;
}
