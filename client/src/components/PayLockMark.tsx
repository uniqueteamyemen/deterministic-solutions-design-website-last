type PayLockMarkProps = {
  compact?: boolean;
  label?: string;
};

/**
 * PayLock's reference mark: an agreed event, one shared reference point,
 * and a readable state. It intentionally avoids lock and payment imagery.
 */
export default function PayLockMark({ compact = false, label }: PayLockMarkProps) {
  return (
    <span className={`paylock-mark ${compact ? "paylock-mark-compact" : ""}`} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className="paylock-mark-event">P</span>
      <span className="paylock-mark-reference"><i /></span>
      <span className="paylock-mark-state">L</span>
    </span>
  );
}
