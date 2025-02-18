import { Controller, type UseFormSetValue } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { SwapFormData } from "./swap-form";

interface TokenSelectorProps {
    formName: "fromToken" | "toToken";
    control: any;
    setValue: UseFormSetValue<SwapFormData>;
    tokens: Record<string, any>;
}

export function TokenSelector({ formName, control, setValue, tokens }: TokenSelectorProps) {
    return (
        <div className="rounded-lg bg-zinc-900 p-4">
            <Controller
                name={formName}
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={(value) => setValue(formName, value)}>
                        <SelectTrigger className="w-[120px] bg-transparent border-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(tokens).map((token) => (
                                <SelectItem key={token.currency} value={token.currency}>
                                    <div className="flex items-center gap-2">
                                        <img src={token.image} alt={token.currency} className="w-6 h-6 rounded-full" />
                                        {token.currency}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
}
