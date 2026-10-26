import { LARAVEL_API_BASE_URL } from "@/constants/api";

type NewsletterResponse = {
  success?: boolean;
  message?: string;
  already_subscribed?: boolean;
};

type NewsletterErrorResponse = {
  message?: string;
  error?: {
    message?: string;
  };
};

function errorMessage(payload: NewsletterErrorResponse | null): string {
  return (
    payload?.error?.message ??
    payload?.message ??
    "تعذر إتمام الاشتراك. حاولي مرة أخرى."
  );
}

export async function subscribeToNewsletter(
  email: string,
  source = "homepage",
): Promise<{ alreadySubscribed: boolean; message: string }> {
  const response = await fetch(`${LARAVEL_API_BASE_URL}/newsletter`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source }),
  });

  const payload = (await response.json().catch(() => null)) as
    | NewsletterResponse
    | NewsletterErrorResponse
    | null;

  if (!response.ok) {
    throw new Error(errorMessage(payload as NewsletterErrorResponse | null));
  }

  return {
    alreadySubscribed: Boolean(
      payload && "already_subscribed" in payload
        ? payload.already_subscribed
        : false,
    ),
    message: errorMessage(payload as NewsletterErrorResponse | null),
  };
}
