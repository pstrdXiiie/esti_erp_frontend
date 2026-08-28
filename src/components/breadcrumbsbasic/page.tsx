import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const navigationData = [
  {
    category: "Accounts & Cash",
    items: [
      { title: "Student Account", href: "/finance/transactions/student_acc" },
      { title: "Sundry Account", href: "/finance/transactions/sundry_acc" },
      { title: "Payments / Cash Receipt Entry", href: "/finance/transactions/payments_cash_entry" },
    ],
  },
  {
    category: "Procurement",
    items: [
      { title: "Purchase Requisition", href: "/finance/transactions/purchase_req" },
      { title: "Purchase Requisition Approval", href: "/finance/transactions/purchase_req_approval" },
      { title: "Purchase Order", href: "/finance/transactions/purchase_order" },
      { title: "Purchase Order Receiving", href: "/finance/transactions/purchase_order_receipt" },
      { title: "Due Purchase Order Payable", href: "/finance/transactions/due_purchase_order" },
    ],
  },
  {
    category: "Vouchers",
    items: [
      { title: "Cheque Voucher Entry", href: "/finance/transactions/cheque_voucher_entry" },
      { title: "Journal Voucher Entry", href: "/finance/transactions/journal_voucher_entry" },
      { title: "Petty Cash Voucher Entry", href: "/finance/transactions/petty_cash_entry" },
      { title: "Petty Cash Canteen Entry", href: "/finance/transactions/pettycash_canteen_entry" },
    ],
  },
]

export function TopNavigation() {
  return (
    <NavigationMenu className="p-2 border-b">
      <NavigationMenuList>
        {navigationData.map((group) => (
          <NavigationMenuItem key={group.category}>
            <NavigationMenuTrigger>{group.category}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[240px] gap-1 p-2">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
