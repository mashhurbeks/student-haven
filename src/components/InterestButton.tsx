import { useEffect, useState } from "react";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import { hasInterest, sendInterest } from "@/lib/interests";

type Props = {
  roommateId: string;
  name: string;
  className?: string;
};

export function InterestButton({ roommateId, name, className = "" }: Props) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(hasInterest(roommateId));
  }, [roommateId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sent) {
          toast.info(`${name}ga taklif allaqachon yuborilgan`);
          return;
        }
        sendInterest(roommateId);
        setSent(true);
        toast.success(`Taklif yuborildi`, {
          description: `${name} sizning profilingizni ko'radi. U ham qiziqsa, so'rovni qabul qiladi.`,
        });
      }}
      className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition active:scale-[0.98] ${
        sent
          ? "bg-success/15 text-success"
          : "bg-primary text-primary-foreground"
      } ${className}`}
    >
      {sent ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2.5} />
          Yuborildi
        </>
      ) : (
        <>
          <Send className="h-4 w-4" strokeWidth={2.2} />
          Taklif
        </>
      )}
    </button>
  );
}
