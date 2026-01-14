export function Container({ children, style }) {
  return (
    <div
      style={{
        padding: "0 2%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
