export default function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}
