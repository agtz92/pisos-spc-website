interface RetroPanelBoxProps {
  children: React.ReactNode;
  className?: string;
  ink: string;
  background: string;
  borderRadius?: number;
  shadowSize?: number;
  style?: React.CSSProperties;
}

export function RetroPanelBox({
  children,
  className,
  ink,
  background,
  borderRadius = 22,
  shadowSize = 10,
  style,
}: RetroPanelBoxProps) {
  return (
    <div
      className={className}
      style={{
        border: `3px solid ${ink}`,
        borderRadius,
        background,
        boxShadow: `${shadowSize}px ${shadowSize}px 0 ${ink}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
