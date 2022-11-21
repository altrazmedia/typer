import ReactDOM from "react-dom";

interface Props extends React.PropsWithChildren {
  close?: () => void;
}

export const Modal: React.FC<Props> = ({ children, close }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-base-100 bg-opacity-80">
      <div className="card bg-base-200 shadow-xl ">
        {!!close && (
          <button className="absolute right-2 top-2 h-6 w-6" onClick={close}>
            <div className="absolute w-4 rotate-45 bg-base-content" style={{ height: 2 }} />
            <div className="absolute w-4 -rotate-45 bg-base-content" style={{ height: 2 }} />
          </button>
        )}
        <div className="card-body pt-9">{children}</div>
      </div>
    </div>,
    document.getElementById("root")!
  );
};
