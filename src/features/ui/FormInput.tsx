interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  error?: string;
}

export const FormInput: React.FC<Props> = ({ error, ...props }) => {
  return (
    <div className="form-control mb-4 w-full max-w-xs">
      <input {...props} className={`input-bordered ${!!error ? "input-error" : ""} input `} />
      {!!error && (
        <label className="label">
          <span className="label-text-alt" style={{ color: "hsl(var(--er))" }}>
            {error}
          </span>
        </label>
      )}
    </div>
  );
};
