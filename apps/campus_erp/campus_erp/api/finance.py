
import frappe
from frappe.utils import date_diff, nowdate


@frappe.whitelist()
def get_due_purchase_order_payables(supplier=None):
	"""Powers the 'Due Purchase Order Payables' grid on SMS Accounts
	Payable. Returns open POs with a computed `aging` in days.
	NOTE: `payment_status` filter is guessed — confirm the real field
	that marks a PO as already paid/closed."""
	filters = {"payment_status": ["!=", "Paid"]}
	if supplier:
		filters["supplier_name"] = ["like", f"%{supplier}%"]

	rows = frappe.get_all(
		"SMS Purchase Order",
		filters=filters,
		fields=[
			"name as ponum",
			"supplier_code as supcode",
			"supplier_name as supname",
			"po_date as podate",
			"date_posted as date_posted",
			"si_num as sinum",
			"po_terms as poterms",
			"po_tax as potax",
			"po_total as poamount",
		],
		limit_page_length=200,
	)

	for row in rows:
		row["aging"] = date_diff(nowdate(), row.get("podate")) if row.get("podate") else 0

	return rows
