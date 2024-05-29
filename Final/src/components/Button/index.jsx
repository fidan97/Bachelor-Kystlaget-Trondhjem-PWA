import { cx } from "class-variance-authority";
import button from "./button.cva";
import { Link } from "react-router-dom";

const Button = ({
  type,
  className,
  children,
  disabled,
  link,
  navLink,
  ...rest
}) => {
  const classes = cx(button(rest), className);
  return (
    <>
      {link && !disabled ? (
        <Link to={link} className={cx(classes, "p-0")} {...rest}>
          {children}
        </Link>
      ) : (
        <button type={type} className={classes} disabled={disabled} {...rest}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
