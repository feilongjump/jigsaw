import { Card, CardBody, CardHeader } from "@heroui/react"

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, headerContent }: AuthLayoutProps) {
  return (
    <div className="flex justify-center items-center flex-1 p-6">
        <Card className="w-full max-w-md bg-transparent shadow-none border-none">
            <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8 relative">
                {headerContent}
                <h1 className="text-2xl font-bold text-[#1A1A1A]">{title}</h1>
                <p className="text-small text-default-500">{subtitle}</p>
            </CardHeader>
            <CardBody className="gap-4 py-8 px-6">
                {children}
            </CardBody>
        </Card>
    </div>
  )
}
