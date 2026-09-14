export default function Container({
  children,
  className = "",
  as: Component = "div",
}) {
  return (
    <Component
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}
    >
      {children}
    </Component>
  );
}