import React from "react";

interface ShapeButtonProps {
  onClick: () => void;
  iconClass?: string;
  label: string;
  className?: string;
}

const ShapeButton: React.FC<ShapeButtonProps> = ({
  onClick,
  iconClass,
  label,
  className,
}) => (
  <button className={`button ${className}`} onClick={onClick}>
    <i className={iconClass}></i> {label}
  </button>
);

export default ShapeButton;
