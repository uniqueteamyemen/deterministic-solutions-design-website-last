type ReferenceMarkProps = {
  compact?: boolean;
  label?: string;
};

export default function ReferenceMark({ compact = false, label }: ReferenceMarkProps) {
  return (
    <span className={`reference-mark ${compact ? "reference-mark-compact" : ""}`} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className="reference-letter reference-letter-d">D</span>
      <span className="reference-letter reference-letter-s">S</span>
      <span className="reference-letter reference-letter-d">D</span>
      <i />
    </span>
  );
}
