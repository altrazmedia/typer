interface Props {
  className?: string;
}

export const Spinner: React.FC<Props> = ({ className = "" }) => {
  return (
    <div className={"flex items-center justify-center " + className}>
      <div
        className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-l-transparent"
        role="status"
      ></div>
    </div>
  );
};
