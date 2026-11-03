import { CheckoutContainer } from "@/features/checkout";
import { getStorefrontSettings } from "@/features/storefront";

export default async function CheckoutPage() {
  const settings = await getStorefrontSettings();

  return (
    <CheckoutContainer
      whatsappNumber={settings.announcement.contact.phone}
    />
  );
}
