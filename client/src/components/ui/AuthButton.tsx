import { type ReactNode } from "react";

interface AuthProps {
  className: string;
  disabled: boolean;
  children: ReactNode;
}

const AuthButton = ({ className, disabled, children }: AuthProps) => {
  return (
    <button type="submit" disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default AuthButton;
