type Props = {
  type?: string;
  placeholder: string;
  name: string;
  onChange: (e: any) => void;
};

export default function Input({ type = "text", ...props }: Props) {
  return (
    <input
      type={type}
      {...props}
      className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}