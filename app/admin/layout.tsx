import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 md:ml-64 overflow-auto">
        <main className="p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
