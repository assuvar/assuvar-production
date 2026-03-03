import OSWrapper from "@/components/os/OSWrapper";
import { employeeNavigation } from "@/config/navigation";

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <OSWrapper navigation={employeeNavigation}>{children}</OSWrapper>;
}
