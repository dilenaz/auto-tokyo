export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className = "",
}) {
  const alignmentClasses =
    align === "center"
      ? "mx-auto items-center text-center"
      : "items-start text-left";

  return (
    <div
      className={`flex max-w-3xl flex-col ${alignmentClasses} ${className}`}
    >
      {eyebrow && (
        <div className="mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-10 bg-tokyo-red"
          />

          <span className="text-xs font-bold uppercase tracking-[0.26em] text-tokyo-red sm:text-sm">
            {eyebrow}
          </span>
        </div>
      )}

      <Heading className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </Heading>

      {description && (
        <p className="mt-5 text-sm leading-7 text-tokyo-silver sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
