export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center bg-amber-50 justify-center">
      <div className="relative z-10 w-full lg:max-w-md">
        {children}
      </div>
    </div>
  );
}
