import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SwapButtonProps {
    loading: boolean;
    disabled: boolean;
}

export function SwapButton({ loading, disabled }: SwapButtonProps) {
    return (
        <Button type="submit" className="w-full py-6 text-lg bg-[#d4ff67] hover:bg-[#c1eb5c] text-black" disabled={disabled}>
            {loading ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : "Swap"}
        </Button>
    );
}
