import Dashboard from "@/components/dashboard/dashboard-index";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Dashboard>{children}</Dashboard>;
}
