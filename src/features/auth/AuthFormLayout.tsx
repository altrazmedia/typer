import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
}

export const AuthFormLayout: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mx-auto mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};
