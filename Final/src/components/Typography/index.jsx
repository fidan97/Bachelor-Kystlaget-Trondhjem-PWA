import { cx } from "class-variance-authority";
import typography from "./typography.cva";
import { useMemo } from "react";

const variantsMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subheading: "h6",
  body1: "p",
  body2: "p",
  small: "p",
};

/**
 * Typography is custom component for h1-h6 and p tag
 * @function
 * @param {string} size for styleSize
 * @param {string} weight for styleWeight
 * @param {string} tag for h1-h6 or p tag
 * @param {string} variant for text color
 */

const Typography = ({
  children,
  tag = "body1",
  className,
  disabled = false,
  size,
  variant,
  ellipses,
  ...props
}) => {
  const Component = variantsMapping[tag];

  // splitting variant name into two section. first will be size and second will be weight
  const [styleSize, styleWeight] = size?.split("/") || [];

  const style = useMemo(() => {
    if (ellipses) {
      return {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: ellipses,
        overflow: "hidden",
      };
    }
    return {};
  }, [ellipses]);

  return (
    <Component
      className={cx(
        typography({ disabled, variant, size: styleSize, weight: styleWeight }),
        className
      )}
      style={style}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
