import { DetailScreen } from "@/components/sms/DetailScreen"
import { studentacc } from "@/lib/forms/finance"

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  return <DetailScreen spec={studentacc} name={name} />
}
