
export const InputError: React.FC<InputErrorProps> = ({ message }) => {
  // We don't need motion or AnimatePresence. We just render the span
  // if a message exists.
  if (!message) {
    return null;
  }

  return (
    <span
      className="flex items-center gap-1 px-2 font-normal text-red-500 bg-red-100 rounded-md text-sm"
    >
      {message}
    </span>
  );
};