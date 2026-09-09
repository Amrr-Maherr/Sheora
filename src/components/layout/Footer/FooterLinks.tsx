type FooterColumn = {
  title: string;
  links: string[];
};

const columns: FooterColumn[] = [
  {
    title: "CUSTOMER SERVICES",
    links: [
      "Contact Us",
      "Track your Order",
      "Shipping & Returns",
      "Frequently Asked Questions",
      "Schedule an Appointment",
    ],
  },
  {
    title: "ABOUT US",
    links: ["Origins", "Our Purpose", "Careers", "Sustainability", "Giving Back"],
  },
  {
    title: "MATERIAL CARE",
    links: [
      "Jewelry Repair",
      "Ring Sizing",
      "Metal Allergy Resources",
      "Styling Tips",
    ],
  },
  {
    title: "MAIN LOCATIONS",
    links: ["Chicago, IL", "San Francisco, CA", "New York, NY", "Seattle, WA"],
  },
];

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
      {columns.map((column) => (
        <div key={column.title}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground">
            {column.title}
          </h2>
          <ul className="mt-5 space-y-3">
            {column.links.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}