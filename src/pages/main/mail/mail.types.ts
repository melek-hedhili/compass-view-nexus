import type { CreateEmailDto } from "@/api-swagger";

export type TabKey = "inbox" | "archived" | "sent";

export type EmailFormProps = CreateEmailDto;
