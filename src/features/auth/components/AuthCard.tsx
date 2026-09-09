import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div
      dir="rtl"
      className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-10"
    >
      <p className="mb-8 text-2xl font-semibold tracking-[0.18em] text-foreground">
        SHEORA
      </p>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && (
            <CardDescription className="text-pretty">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>{children}</CardContent>

        {footer && (
          <CardFooter className="border-t pt-6 text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}