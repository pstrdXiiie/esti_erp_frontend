import { DetailScreen } from "@/components/sms/DetailScreen"
import { cashReceipt } from "@/lib/forms/finance"

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  return <DetailScreen spec={cashReceipt} name={name} />
}